import * as Knex from "knex";
const { onUpdateTrigger } = require("../../knexfile");

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("user_account", function (t) {
      t.uuid("user_id").primary().notNullable().defaultTo(knex.raw("uuid_generate_v4()"));
      t.string("email").notNullable().unique();
      t.boolean("verified").notNullable().defaultTo(false);
      t.text("password").notNullable();
      t.string("username").notNullable().unique();
      t.timestamps(false, true);
    })
    .then(() => knex.raw(onUpdateTrigger("user_account")))
    .then(() => console.log("=> user_account table created..."));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("user_account").then(() => console.log("=> dropped user_account..."));
}
