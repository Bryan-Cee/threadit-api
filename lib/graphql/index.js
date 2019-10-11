const path = require('path');
const { importSchema } = require('graphql-import');

const resolvers = require('./resolvers');
const testQuery = require('../datasource');

const typeDefs = importSchema(path.join(__dirname, '/schema.graphql'));
const context = ({ req }) => ({ client: { testQuery }, req });

module.exports = {
  config: { typeDefs, resolvers, context }
};
