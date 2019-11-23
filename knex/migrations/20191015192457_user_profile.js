const Promise = require("promise");

exports.up = function(knex) {
  return knex.schema.createTable("user_profile", function(t) {
    t.bigIncrements("profile_id").primary().unsigned();
    t.string("avatar").nullable();
    t.string("name").nullable();
    t.text("bio").nullable();
    t.string("location").nullable();
    t.boolean("first_setup").nullable().defaultTo(true);
    t.timestamps(false, true);
    t.integer("user_id").unsigned().notNullable();

    t.foreign("user_id")
      .references("user_id")
      .inTable("user_account");
  }).then(() => {
    console.log("=> User_followers table created...");
    return knex.raw(`
      CREATE OR REPLACE VIEW user_profile_info AS
      SELECT u.user_id, p.profile_id, u.username, 
      u.email, p.name, p.bio, p.location, p.avatar, 
      p.first_setup, u.created_at, u.updated_at
      FROM user_account u
      LEFT JOIN user_profile p
      ON u.user_id = p.user_id
    `);
  }).then(() => console.log("=> User_profile_info view created..."));
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable("user_profile"),
    knex.raw(`
      DROP VIEW IF EXISTS user_profile_info;
    `)
  ]);
};
