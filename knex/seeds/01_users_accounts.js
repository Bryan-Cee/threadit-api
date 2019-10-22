
exports.seed = function(knex, Promise) {
  console.log("=> seeding user_account...");
  // Deletes ALL existing entries
  return knex("user_account").del()
    .then(function() {
    // Inserts seed entries
      const users = {
        email: "ceebryan@gmail.com",
        password:
        `$2b$10$h4FBz1GVS75zZnDGO9.ykOGf7eNptRrb.zYWxWSAHf7hlKL3.QbDi`,
        username: "ceebryan"
      };

      const users2 = {
        email: "bryancee@gmail.com",
        password:
        `$2b$10$h4FBz1GVS75zZnDGO9.ykOGf7eNptRrb.zYWxWSAHf7hlKL3.QbDi`,
        username: "bryancee"
      };
      return knex("user_account").insert([users, users2]);
    });
};
