
exports.seed = function(knex) {
  console.log("=> seeding community_members...");
  // Deletes ALL existing entries
  return knex("community_members").del()
    .then(async function() {
    // Inserts seed entries
      const profileId = await knex
        .select("profile_id")
        .from("user_profile");
      const communityIds = await knex
        .select("community_id")
        .from("communities");

      const authorCommunity = Array.from({ length: 2 }, (_, i) => {
        return {
          member_id: profileId[i].profile_id,
          community_id: communityIds[i].community_id,
        };
      });
      return knex("community_members").insert(authorCommunity);
    });
};
