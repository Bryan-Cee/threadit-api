
exports.up = function(knex) {
  return knex.schema.createTable("communities", function(t) {
    t.bigIncrements("community_id").primary().unsigned();
    t.string("name").unique().notNullable();
    t.text("description").nullable();
    t.timestamps(false, true);
  }).then(() => console.log("=> Communities table created..."));
};

exports.down = function(knex) {
  return knex.schema.dropTable("communities");
};
