require("dotenv-safe").config();

const NODE_ENV = process.env.NODE_ENV;
const config = require("../knexfile")[NODE_ENV];

module.exports = require("knex")(config);
