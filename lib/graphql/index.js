const { PubSub } = require("apollo-server");
const path = require("path");
const { importSchema } = require("graphql-import");

const resolvers = require("./resolvers");
const client = require("../datasource");
const pubsub = new PubSub();

const typeDefs = importSchema(path.join(__dirname, "/schema.graphql"));
const context = ({ req }) => ({ client, req, pubsub });

module.exports = {
  config: { typeDefs, resolvers, context }
};
