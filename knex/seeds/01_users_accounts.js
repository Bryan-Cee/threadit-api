
exports.seed = function(knex, Promise) {
  console.log("seeding user_account...");
  // Deletes ALL existing entries
  return knex("user_account").del()
    .then(function() {
      // Inserts seed entries
      const users = {
        id: 1,
        email: "ceebryan@gmail.com",
        password: "a;lsdjf34qpntalv49876qoasdfuo3423as4v.78y"
      };
      return knex("user_account").insert(users);
    });
};
