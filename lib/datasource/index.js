const knex = require("../../knex");
const humps = require("humps");

async function getUserById(userId) {
  const user = await knex
    .select()
    .from("users")
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

async function getUserByUsername(username) {
  const [user] = await knex.select().from("users").where({ username });
  return user;
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

async function createCommunity(name, description) {
  try {
    const [community] = await knex("communities")
      .returning(["*"])
      .insert({ name, description });
    return humps.camelizeKeys(community);
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
module.exports = {
  createCommunity,
  createUser,
  editUserProfile,
  followUserProfile,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  getUserProfile,
  usernameTaken,
};
