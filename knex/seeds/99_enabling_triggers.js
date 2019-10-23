const Promise = require("promise");

exports.seed = function(knex) {
  console.log("=> enabling all hidden triggers...");
  // Deletes ALL existing entries

  return Promise.all([
    knex.raw(`ALTER TABLE user_account ENABLE TRIGGER ALL`),
    knex.raw(`ALTER TABLE user_followers ENABLE TRIGGER ALL`),
    knex.raw(`ALTER TABLE user_profile ENABLE TRIGGER ALL`),
    knex.raw(`ALTER TABLE communities ENABLE TRIGGER ALL`)
  ]);
};