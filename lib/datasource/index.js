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
  const [user] = await knex("user_account")
    .returning(["user_id", "username", "email"])
    .insert({ email, password, username });
  return humps.camelizeKeys(user);
}

module.exports = {
  createUser,
  editUserProfile,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  getUserProfile,
  usernameTaken
};
