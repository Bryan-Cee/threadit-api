const Promise = require("promise");

exports.seed = function(knex) {
  console.log("=> disabling all hidden triggers...");
  // Deletes ALL existing entries

  return Promise.all([
    knex.raw(`ALTER TABLE user_account DISABLE TRIGGER ALL`),
    knex.raw(`ALTER TABLE user_followers DISABLE TRIGGER ALL`),
    knex.raw(`ALTER TABLE user_profile DISABLE TRIGGER ALL`),
    knex.raw(`ALTER TABLE communities DISABLE TRIGGER ALL`)
  ]);
};
