const humps = require("humps");
const knex = require("../../knex");
const { convertTimeToString } = require("../helpers");

async function getUserAccountById(userId) {
  const user = await knex
    .select("user_id", "username", "email")
    .from("user_account")
    .where({ user_id: userId });
  return user[0] ? humps.camelizeKeys(user[0]) : user;
}

async function getUserByEmail(email) {
  const user = await knex
    .select()
    .from("user_account")
    .where({ email });
  return user[0] ? humps.camelizeKeys(user[0]) : user;
}

async function getUserProfile(userId) {
  const user = await knex
    .from("user_profile_info")
    .where({ user_id: userId });
  return user[0] ? humps.camelizeKeys(user[0]) : user;
}

async function editUserProfile(args) {
  const { userId } = args;

  delete args.userId;

  const user = await knex("user_profile")
    .update(humps.decamelizeKeys(args), ["*"])
    .where({ user_id: userId });

  if (!user.length) throw new Error("User not found!");

  const userProfile = await knex
    .select()
    .from("user_profile_info")
    .where({ user_id: userId });

  return humps.camelizeKeys(userProfile[0]);
}

async function usernameTaken(name) {
  const user = await knex
    .select("username")
    .from("user_account")
    .where({ username: name });
  return !!user && !!user[0] && !!user[0].username;
}

async function createUser(email, password, username) {
  try {
    const [user] = await knex("user_account")
      .returning(["user_id", "username", "email"])
      .insert({ email, password, username });

    // Create a user profile which will be updated later
    await knex("user_profile")
      .returning(["*"])
      .insert({ user_id: user.user_id });
    return humps.camelizeKeys(user);
  } catch (e) {
    if (e && e.detail && e.detail.startsWith("Key")) {
      // Format error message
      const errorMessage = `${e.detail
        .replace("Key", "User with the")
        .replace(/\(/g, "")
        .replace(/\)/g, "")
        .replace("=", " ")} Try logging in!`;
      throw new Error(errorMessage);
    }
  }
}

async function createComment(message, authorId, postId) {
  const _input = humps.decamelizeKeys({ message, authorId, postId });
  try {
    const [comment] = await knex("user_comments")
      .returning(["*"])
      .insert(_input);
    return convertTimeToString(humps.camelizeKeys(comment));
  } catch (e) {
    if (e.code === "23503") {
      throw new Error("Post not found!");
    }
    console.log(e);
    throw new Error("Something went wrong, try again!");
  }
}

async function followUserProfile(profileId, followerId) {
  try {
    const { rows } = await knex.raw(
      `
      SELECT total_followers, followed
      FROM toggle_follow(?, ?)
      AS (total_followers BIGINT, followed BOOL)
      `,
      [profileId, followerId],
    );
    return humps.camelizeKeys(rows[0]);
  } catch (e) {
    if (e && e.detail && e.detail.includes("is not present")) {
      throw new Error("User not found!");
    }
    throw new Error(e);
  }
}

async function createCommunity(name, description, founderId) {
  try {
    const [community] = await knex("communities")
      .returning(["*"])
      .insert({ name, description, founder_id: founderId });
    return convertTimeToString(humps.camelizeKeys(community));
  } catch (e) {
    if (e && e.detail && e.detail.includes("already exists")) {
      // formatting error message for duplicate key violation
      const errorMessage = `${e.detail
        .replace("Key", "Community with the")
        .replace(/\(/g, "")
        .replace(/\)/g, "")
        .replace("=", " ")}`;
      throw new Error(errorMessage);
    }
  }
}

async function getCommunityMemberId(memberId, communityId) {
  const _communityMember = humps.decamelizeKeys({ memberId, communityId });

  const id = await knex.select("id")
    .from("community_members")
    .where(_communityMember);

  return id[0] ? humps.camelizeKeys(id[0]) : id;
}

async function getComments(postId, after, first) {
  const _comments = await knex.select()
    .from("user_comments")
    .where({ post_id: postId })
    .orderBy("created_at", "desc")
    .limit(first).offset(after);
  const comments = _comments.map(comment => {
    return convertTimeToString(humps.camelizeKeys(comment));
  });
  return comments;
}

async function getPost(postId) {
  const [post] = await knex.select()
    .from("user_posts")
    .where({ post_id: postId });

  return convertTimeToString(humps.camelizeKeys(post));
}

async function getCommunityById(communityId) {
  const community = await knex.select()
    .from("communities")
    .where({ community_id: communityId });

  return community[0]
    ? convertTimeToString(humps.camelizeKeys(community[0]))
    : community;
}

async function getCommunityList(after, first) {
  const _communities = await knex.select()
    .from("communities")
    .limit(first).offset(after);

  const communities = _communities.map(community => {
    return convertTimeToString(humps.camelizeKeys(community));
  });
  const [{ count }] = await knex("communities").count();
  return {
    count,
    communities,
  };
}

// Consider making this a binary resolver
// for both joining and leaving a community
async function joinCommunity(communityId, memberId) {
  const _input = humps.decamelizeKeys({
    communityId,
    memberId,
  });
  try {
    const [community] = await knex("community_members")
      .returning(["*"])
      .insert(_input);
    const {
      name,
      description
    } = await getCommunityById(community.community_id);
    return { name, description };
  } catch (e) {
    // The error code represents the unique_violation constraint
    // from the community_members
    if (e.code === "23505") {
      throw new Error("You are already a member of this community!");
    }
    // The error code represents the foreign_key_violation
    // constraint from the communities table.
    if (e.code === "23503") {
      throw new Error("Community not found!");
    }
  }
}

async function getProfileById(profileId) {
  const profile = await knex.select("*")
    .from("user_profile_info")
    .where({ profile_id: profileId });
  return profile[0]
    ? convertTimeToString(humps.camelizeKeys(profile[0]))
    : profile;
}

async function createPost(content, authorCommunity) {
  const _input = humps.decamelizeKeys({
    content,
    authorCommunity,
  });
  try {
    const [post] = await knex("user_posts")
      .returning(["*"])
      .insert(_input);
    return convertTimeToString(humps.camelizeKeys(post));
  } catch (e) {
    // Handle error accordingly
    console.log(e);
  }
}

module.exports = {
  createComment,
  createCommunity,
  createPost,
  createUser,
  editUserProfile,
  followUserProfile,
  getComments,
  getCommunityById,
  getCommunityMemberId,
  getCommunityList,
  getPost,
  getProfileById,
  getUserAccountById,
  getUserByEmail,
  getUserProfile,
  joinCommunity,
  usernameTaken,
};
