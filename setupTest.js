const config = require("./knexfile").testing;

const knex = require("knex")(config);

knex.schema.raw("DROP SCHEMA public CASCADE").then(() => {
  console.log("Drop public schema to erase all test data...");
}).then(() => knex.raw("CREATE SCHEMA public").then(() => {
  console.log("Created the schema!");
}))
  .then(() => process.exit())
  .catch((err) => console.error(err));

