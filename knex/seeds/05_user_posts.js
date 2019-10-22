
exports.seed = function(knex) {
  console.log("=> seeding user_posts...");
  // Deletes ALL existing entries
  return knex("user_posts").del()
    .then(async function() {
    // Inserts seed entries
      const authorIds = await knex
        .select("profile_id")
        .from("user_profile");
      const communityIds = await knex
        .select("community_id")
        .from("communities");

      const posts = authorIds.map((item, index) => {
        return {
          content: "Thread-it, the main community every user joins by default",
          author_id: item.profile_id,
          community_id: +communityIds[index].community_id
        };
      });
      return knex("user_posts").insert(posts);
    });
};
