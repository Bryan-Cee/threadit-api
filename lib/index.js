// load the .env file with the variable
require("dotenv-safe").config();
const { ApolloServer } = require("apollo-server");
const { config } = require("./graphql");

const server = new ApolloServer(config);
const PORT = process.env.PORT;

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
