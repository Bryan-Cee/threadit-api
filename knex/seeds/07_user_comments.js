
exports.seed = function(knex) {
  console.log("=> seeding user_comments...");
  // Deletes ALL existing entries
  return knex("user_comments").del()
    .then(async function() {
    // Inserts seed entries
      const posts = await knex.select("post_id").from("user_posts");
      const authors = await knex.select("profile_id").from("user_profile");
      const comments = posts.map((post, i) => {
        return {
          post_id: post.post_id,
          author_id: authors[i].profile_id,
          message: `Comm by profile ${authors[i].profile_id} > ${post.post_id}`
        };
      });
      return knex("user_comments").insert(comments);
    });
};
