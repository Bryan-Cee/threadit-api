import * as Knex from "knex";
const { onUpdateTrigger } = require("../../knexfile");

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("user_profile", function (t) {
      t.uuid("profile_id").primary().notNullable().defaultTo(knex.raw("uuid_generate_v4()"));
      t.string("avatar").nullable();
      t.string("name").nullable();
      t.text("bio").nullable();
      t.string("location").nullable();
      t.boolean("first_setup").nullable().defaultTo(true);
      t.timestamps(false, true);
      t.uuid("user_id").notNullable();
      t.foreign("user_id").references("user_id").inTable("user_account");
    })
    .then(() => knex.raw(onUpdateTrigger("user_profile")))
    .then(() => {
      console.log("=> User_profile table created...");
      return knex.raw(`
          CREATE OR REPLACE VIEW user_profile_info AS
          SELECT u.user_id, p.profile_id, u.username, 
          u.email, p.name, p.bio, p.location, p.avatar, 
          p.first_setup, u.verified, u.created_at, u.updated_at
          FROM user_account u
          LEFT JOIN user_profile p
          ON u.user_id = p.user_id
        `);
    })
    .then(() => console.log("=> user_profile_info view created..."));
}

export async function down(knex: Knex): Promise<void> {
  return Promise.all([
    knex.schema.dropTable("user_profile"),
    knex.raw(`DROP VIEW IF EXISTS user_profile_info;`),
  ]).then(() => console.log("=> user_profile_info deleted..."));
}
