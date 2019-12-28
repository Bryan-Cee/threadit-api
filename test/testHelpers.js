const { config } = require("../lib/graphql");
const { ApolloServer } = require("apollo-server");
const { createTestClient } = require("apollo-server-testing");

function createTestSever(context = config.context) {
  const _config = { ...config, context };
  const server = new ApolloServer(_config);
  const { query } = createTestClient(server);
  return { query };
}

module.exports = createTestSever;
