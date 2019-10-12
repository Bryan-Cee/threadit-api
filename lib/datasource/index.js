const knex = require("../../knex");

async function testQuery() {
  const { rows: [{ test }] } = await knex.raw("SELECT 1 AS test");
  return test;
}

async function getUserById(id) {
  const [user] = await knex.select().from("users").where({ id });
  return user;
}

async function createUser(email, password) {
  const user = await knex("user_account")
    .returning(["id", "email"])
    .insert({ email, password });
  return user;
}

module.exports = {
  testQuery,
  getUserById,
  createUser
};

// Request user details
//  - username
//  - password

// Validate user data
// Make mutation to the backend
// Validate user doesn't exists
// Create user
