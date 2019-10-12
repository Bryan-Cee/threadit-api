
exports.up = function(knex) {
  return knex.schema.createTable("user_account", function(t) {
    t.increments("id").unsigned().primary();
    t.string("email").notNull().unique();
    t.text("password").notNull();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("user_account");
};
