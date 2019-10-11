const path = require('path');
const { importSchema } = require('graphql-import');

const resolvers = require('./resolvers');

const typeDefs = importSchema(path.join(__dirname, '/schema.graphql'));

module.exports = {
  config: { typeDefs, resolvers }
};
