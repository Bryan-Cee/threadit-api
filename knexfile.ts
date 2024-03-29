require("dotenv").config();

module.exports = {
  development: {
    client: "pg",
    connection: process.env.DEV_DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: `${__dirname}/knex/migrations`,
    },
    seeds: {
      directory: `${__dirname}/knex/seeds`,
    },
  },

  testing: {
    client: "pg",
    connection: process.env.TEST_DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: `${__dirname}/knex/migrations`,
    },
    seeds: {
      directory: `${__dirname}/knex/seeds`,
    },
  },

  staging: {
    client: "pg",
    connection: process.env.STAGING_DATABASE_URI,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: `${__dirname}/knex/migrations`,
    },
    seeds: {
      directory: `${__dirname}/knex/seeds`,
    },
  },

  production: {
    client: "pg",
    connection: process.env.PROD_DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: `${__dirname}/knex/migrations`,
    },
  },

  onUpdateTrigger: (table: string) => `
    CREATE TRIGGER ${table}_updated_at
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
  `,
};
