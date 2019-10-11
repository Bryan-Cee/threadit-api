const knex = require('../../knex');

async function testQuery() {
  const { rows: [{ test }]} = await knex.raw(`SELECT 1 AS test`);
  return test
}

module.exports = testQuery;
