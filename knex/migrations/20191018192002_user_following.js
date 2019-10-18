
exports.up = function(knex) {
  return knex.schema.createTable("user_followers", function(t) {
    t.integer("user_id").references("profile_id").inTable("user_profile");
    t.integer("follower_id").references("profile_id").inTable("user_profile");

    t.primary(["user_id", "follower_id"]).unique(["user_id", "follower_id"]);
  }).then(() => console.log("=> User_followers table created..."));
};

exports.down = function(knex) {
  return knex.schema.dropTable("user_followers");
};
