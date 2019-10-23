
exports.seed = function(knex, Promise) {
  console.log("=> seeding communities...");
  // Deletes ALL existing entries
  return knex("communities").del()
    .then(async function() {
    // Inserts seed entries
      const profileIds = await knex.select("profile_id").from("user_profile");

      const community = {
        community_id: 1,
        name: "Thread-it",
        description: "The main community every user joins by default",
        founder_id: profileIds[0].profile_id
      };
      const community1 = {
        community_id: 2,
        name: "dank-memes",
        description: "All dank memers know what it's all about",
        founder_id: profileIds[1].profile_id
      };
      return knex("communities").insert([community, community1]);
    });
};
