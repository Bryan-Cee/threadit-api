const path = require("path");
const { importSchema } = require("graphql-import");

const resolvers = require("./resolvers");
const client = require("../datasource");

const typeDefs = importSchema(path.join(__dirname, "/schema.graphql"));
const context = ({ req }) => ({ client, req });

module.exports = {
  config: { typeDefs, resolvers, context }
};
