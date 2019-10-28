
exports.up = function(knex) {
  return knex.schema.createTable("user_comments", function(t) {
    t.bigIncrements("comment_id").primary().unsigned();
    t.text("message").notNullable();
    t.timestamps(false, true);
    t.integer("post_id").unsigned().notNullable();
    t.integer("author_id").unsigned().notNullable();

    t.foreign("post_id")
      .references("post_id")
      .inTable("user_posts");
    t.foreign("author_id")
      .references("profile_id")
      .inTable("user_profile");
  }).then(() => console.log("=> User_comments table created..."));
};

exports.down = function(knex) {
  return knex.schema.dropTable("user_comments");
};
