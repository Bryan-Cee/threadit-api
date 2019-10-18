
exports.seed = function(knex, Promise) {
  console.log("=> seeding user_profile...");
  // Deletes ALL existing entries
  return knex("user_profile").del()
    .then(function() {
    // Inserts seed entries
      const usersProfile = {
        avatar: "https://images.unsplash.com/photo-1571101628768-6bae026844b6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
        name: "Bryan Cee",
        bio: "A frontend developer Javascript/ReactJS",
        location: "Nairobi - Kenya",
        user_id: 1
      };

      const usersProfile2 = {
        avatar: "https://images.unsplash.com/photo-1571101628768-6bae026844b6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
        name: "Bryan Cee",
        bio: "A frontend developer Javascript/ReactJS",
        location: "Nairobi - Kenya",
        user_id: 2
      };
      return knex("user_profile").insert([usersProfile, usersProfile2]);
    });
};
