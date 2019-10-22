
exports.up = function(knex) {
  return knex.schema.createTable("user_posts", function(t) {
    t.bigIncrements("post_id").primary().unsigned();
    t.text("content").nullable();
    t.timestamps(false, true);
    t.integer("author_id").unsigned().notNullable();
    t.integer("community_id").unsigned().notNullable();

    t.foreign("author_id")
      .references("profile_id")
      .inTable("user_profile");

    t.foreign("community_id")
      .references("community_id")
      .inTable("communities");
  }).then(() => console.log("=> User_posts table created..."));
};

exports.down = function(knex) {
  return knex.schema.dropTable("user_posts");
};
