
exports.up = function(knex) {
  return knex.schema.createTable("users", function(t) {
    t.increments("id").unsigned().primary();
    t.string("username").notNull();
    t.text("firstname").notNull();
    t.text("lastname").notNull();
    t.text("avatar").nullable();
    t.text("password").notNull();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
