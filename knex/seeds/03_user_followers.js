
exports.seed = function(knex, Promise) {
  console.log("=> seeding user_followers...");
  // Deletes ALL existing entries
  return knex("user_followers").del()
    .then(async function() {
    // Inserts seed entries
      const userIds = await knex.select("user_id").from("user_profile");

      const following = {
        profile_id: userIds[0].user_id,
        follower_id: userIds[1].user_id
      };
      const following2 = {
        profile_id: userIds[1].user_id,
        follower_id: userIds[0].user_id
      };
      return knex("user_followers").insert([following, following2]);
    });
};
