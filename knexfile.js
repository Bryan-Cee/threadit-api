require("dotenv-safe").config();

module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: `${__dirname}/knex/migrations`
    },
    seeds: {
      directory: `${__dirname}/knex/seeds`
    }
  },

  testing: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: `${__dirname}/knex/migrations`
    },
    seeds: {
      directory: `${__dirname}/knex/seeds`
    }
  },

  staging: {
    client: "pg",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: `${__dirname}/knex/migrations`
    }
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: `${__dirname}/knex/migrations`
    },
    seeds: {
      directory: `${__dirname}/knex/seeds`
    }
  }
};
