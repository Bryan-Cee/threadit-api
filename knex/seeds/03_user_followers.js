
exports.seed = function(knex, Promise) {
  console.log("seeding user_followers...");
  // Deletes ALL existing entries
  return knex("=> user_followers").del()
    .then(function() {
    // Inserts seed entries
      const following = {
        user_id: 1,
        follower_id: 2
      };
      const following2 = {
        user_id: 2,
        follower_id: 1
      };
      return knex("user_followers").insert([following, following2]);
    });
};
