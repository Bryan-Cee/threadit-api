
exports.up = function(knex) {
  return knex.schema.createTable("user_posts", function(t) {
    t.bigIncrements("post_id").primary().unsigned();
    t.text("content").nullable();
    t.timestamps(false, true);
    t.integer("author_community").references("id")
      .inTable("community_members");
  }).then(() => console.log("=> User_posts table created..."));
};

exports.down = function(knex) {
  return knex.schema.dropTable("user_posts");
};
