
exports.seed = function(knex, Promise) {
  console.log("seeding users...");
  // Deletes ALL existing entries
  return knex("users").del()
    .then(function() {
      // Inserts seed entries
      const users = {
        id: 1,
        username: "Bryce",
        firstname: "Brian",
        lastname: "Cee",
        password: "a;lsdjf34qpntalv49876qoasdfuo3423as4v.78y",
        avatar: "https://images.unsplash.com/photo-1556911259-f9849ab65850?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80"
      };
      return knex("users").insert(users);
    });
};
