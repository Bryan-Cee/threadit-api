require("dotenv-safe").config();

const NODE_ENV = process.env.NODE_ENV;
const config = require("./knexfile")[NODE_ENV];

const knex = require("knex")(config);

knex.schema.raw("DROP SCHEMA public CASCADE").then(() => {
  console.log("Drop public schema to erase all test data...");
}).then(() => knex.raw("CREATE SCHEMA public").then(() => {
  console.log("Created the schema!");
}))
  .then(() => process.exit())
  .catch((err) => console.error(err));

