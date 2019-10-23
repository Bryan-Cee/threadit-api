
exports.up = function(knex) {
  return knex.schema.createTable("community_members", function(t) {
    t.bigIncrements("id").primary().notNullable();
    t.integer("community_id").notNullable();
    t.integer("member_id").notNullable();
    t.unique(["community_id", "member_id"]);

    t.foreign("community_id").references("community_id").inTable("communities");
    t.foreign("member_id").references("profile_id").inTable("user_profile");
  }).then(() => console.log("=> Community_members table created..."));
};

exports.down = function(knex) {
  return knex.schema.dropTable("community_members");
};
