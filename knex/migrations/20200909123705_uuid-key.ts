import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
      .then(() => console.log("=> enable uuid-ossp..."));
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"')
      .then(() => console.log("=> dropped extensions..."));
}
