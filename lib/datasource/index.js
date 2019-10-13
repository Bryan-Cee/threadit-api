const knex = require("../../knex");

async function getUserById(id) {
  const [user] = await knex.select().from("users").where({ id });
  return user;
}

async function getUserByEmail(email) {
  const user = await knex
    .select()
    .from("user_account")
    .where({ email });
  return user[0] ? user[0] : user;
}

async function getUserByUsername(username) {
  const [user] = await knex.select().from("users").where({ username });
  return user;
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
    .returning(["id", "username", "email"])
    .insert({ email, password, username });
  return user;
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  usernameTaken
};

// Request user details
//  - username
//  - password

// Validate user data
// Make mutation to the backend
// Validate user doesn't exists
// Create user
