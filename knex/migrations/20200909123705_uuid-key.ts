import * as Knex from "knex";

const ON_UPDATE_TIMESTAMP_FUNCTION = `
  CREATE OR REPLACE FUNCTION on_update_timestamp()
  RETURNS trigger AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
$$ language 'plpgsql';
`;

const DROP_ON_UPDATE_TIMESTAMP_FUNCTION = `DROP FUNCTION on_update_timestamp`;

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .then(() => console.log("=> enable uuid-ossp..."))
    .then(() => knex.raw(ON_UPDATE_TIMESTAMP_FUNCTION))
    .then(() => console.log("=> created timestamp function..."));
}

export async function down(knex: Knex): Promise<void> {
  return knex
    .raw('DROP EXTENSION IF EXISTS "uuid-ossp"')
    .then(() => console.log("=> dropped extensions..."))
    .then(() => knex.raw(DROP_ON_UPDATE_TIMESTAMP_FUNCTION))
    .then(() => console.log("=> deleted timestamp function..."));
}
