const NODE_ENV = process.env.NODE_ENV || "development";
const config = require("../knexfile")[NODE_ENV];

module.exports = require("knex")(config);
