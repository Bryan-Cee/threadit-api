const { ApolloServer } = require('apollo-server');
const { config } = require('./graphql');

const server = new ApolloServer(config);

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
