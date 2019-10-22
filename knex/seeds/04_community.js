
exports.seed = function(knex, Promise) {
  console.log("=> seeding communities...");
  // Deletes ALL existing entries
  return knex("communities").del()
    .then(function() {
    // Inserts seed entries
      const community = {
        community_id: 1,
        name: "Thread-it",
        description: "The main community every user joins by default",
      };
      const community1 = {
        community_id: 2,
        name: "dank-memes",
        description: "All dank memers know what it's all about",
      };
      return knex("communities").insert([community, community1]);
    });
};
