const knex = require("../../knex");

async function getUserById(id) {
  const [user] = await knex.select().from("users").where({ id });
  return user;
}

async function usernameTaken(name) {
  const [{ username }] = await knex
    .select("username")
    .from("user_account")
    .where({ username: name });

  return !!username;
}

async function createUser(email, password, username) {
  const [user] = await knex("user_account")
    .returning(["id", "username"])
    .insert({ email, password, username });
  return user;
}

module.exports = {
  createUser,
  getUserById,
  usernameTaken
};

// Request user details
//  - username
//  - password

// Validate user data
// Make mutation to the backend
// Validate user doesn't exists
// Create user
