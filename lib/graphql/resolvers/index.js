
module.exports = {
  Query: {
    test: async (_, __, { client }) => {
      const result = await client.testQuery();
      return `Hello ${result}`;
    },
    user: async (_, { id }, { client }) => {
      const user = await client.getUser(id);
      return user;
    }
  },
  Mutation: {
    signup: async (_, {
      firstname,
      lastname,
      username,
      password
    }, { client }) => {
      const user = client.createUser(username, firstname, lastname, password);
      return user;
    }
  }
};
