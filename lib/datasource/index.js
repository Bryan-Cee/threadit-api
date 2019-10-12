const knex = require("../../knex");

async function testQuery() {
  const { rows: [{ test }] } = await knex.raw("SELECT 1 AS test");
  return test;
}

async function getUser(id) {
  const [user] = await knex.select().from("users").where({ id });
  return user;
}

async function createUser(username, firstname, lastname, password) {
  const user = await knex("users")
    .returning(["username", "firstname", "lastname", "password"])
    .insert({ username, firstname, lastname, password });

  console.log(user);
  return user;
}

module.exports = {
  testQuery,
  getUser,
  createUser
};

// Request user details
//  - first name
//  - last name
//  - username
//  - password

// Validate user data
// Make mutation to the backend
// Validate user doesn't exists
// Create user
