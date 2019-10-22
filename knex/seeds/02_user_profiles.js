
exports.seed = function(knex, Promise) {
  console.log("=> seeding user_profile...");
  // Deletes ALL existing entries
  return knex("user_profile").del()
    .then(async function() {
    // Inserts seed entries
      const userIds = await knex.select("user_id").from("user_account");
      const userProfiles = userIds.map(item => {
        return {
          avatar: "https://images.unsplash.com/photo-1571101628768-6bae026844b6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
          name: "Bryan Cee",
          bio: "A frontend developer Javascript/ReactJS",
          location: "Nairobi - Kenya",
          user_id: item.user_id
        };
      });

      return knex("user_profile").insert(userProfiles);
    });
};
