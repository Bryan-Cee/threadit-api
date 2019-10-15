
exports.up = function(knex) {
  return knex.schema.createTable("user_account", function(t) {
    t.bigIncrements("user_id").primary().unsigned();
    t.string("email").notNullable().unique();
    t.text("password").notNullable();
    t.string("username").notNullable().unique();
    t.text("resetPasswordToken").nullable();
    t.text("resetPasswordExpires").nullable();
    t.timestamps(false, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("user_account");
};
