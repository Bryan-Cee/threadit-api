
exports.seed = function(knex) {
  console.log("=> seeding user_posts...");
  // Deletes ALL existing entries
  return knex("user_posts").del()
    .then(async function() {
    // Inserts seed entries
      const authorCommunityId = await knex
        .select("id")
        .from("community_members");
      const posts = authorCommunityId.map((item, index) => {
        return {
          content: "Thread-it, the main community every user joins by default",
          author_community: item.id,
        };
      });
      return knex("user_posts").insert(posts);
    });
};
