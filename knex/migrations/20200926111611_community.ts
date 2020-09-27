import * as Knex from "knex";
const { onUpdateTrigger } = require("../../knexfile");

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("community", function(t) {
        t.uuid("community_id").primary().notNullable().defaultTo(knex.raw("uuid_generate_v4()"));
        t.string("name").unique().notNullable();
        t.text("description").nullable();
        t.uuid("founder_id").notNullable();
        t.timestamps(false, true);
        t.foreign("founder_id")
          .references("profile_id")
          .inTable("user_profile");
    }).then(() => knex.raw(onUpdateTrigger('community')))
      .then(() => console.log("=> Community table created..."))
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("community");
}

