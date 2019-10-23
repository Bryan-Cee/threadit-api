
exports.up = function(knex) {
  return knex.schema.createTable("communities", function(t) {
    t.bigIncrements("community_id").primary().unsigned();
    t.string("name").unique().notNullable();
    t.text("description").nullable();
    t.integer("founder_id").unsigned().notNullable();
    t.timestamps(false, true);

    t.foreign("founder_id")
      .references("profile_id")
      .inTable("user_profile");
  }).then(() => console.log("=> Communities table created..."));
};

exports.down = function(knex) {
  return knex.schema.dropTable("communities");
};
