require("dotenv").config();

const NODE_ENV = process.env.NODE_ENV || "development";
const config = require("../knexfile")[NODE_ENV];

import knex = require("knex");

export default knex(config);
