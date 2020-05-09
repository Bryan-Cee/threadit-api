const { PubSub } = require("apollo-server");
const path = require("path");
const { importSchema } = require("graphql-import");

// const authenticate = require("../auth");
const resolvers = require("./resolvers");
const client = require("../datasource");
const pubsub = new PubSub();

const typeDefs = importSchema(path.join(__dirname, "/schema.graphql"));
const context = async ({ req }) => {
  try {
    // const user = await authenticate(req);
    // console.log({ user });
    return { client, req, pubsub };
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = {
  config: { typeDefs, resolvers, context }
};
