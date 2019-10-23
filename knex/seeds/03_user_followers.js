
exports.seed = function(knex, Promise) {
  console.log("=> seeding user_followers...");
  // Deletes ALL existing entries
  return knex("user_followers").del()
    .then(async function() {
    // Inserts seed entries
      const profileIds = await knex.select("profile_id").from("user_profile");

      const following = {
        profile_id: profileIds[0].profile_id,
        follower_id: profileIds[1].profile_id
      };
      const following2 = {
        profile_id: profileIds[1].profile_id,
        follower_id: profileIds[0].profile_id
      };
      return knex("user_followers").insert([following, following2]);
    });
};
