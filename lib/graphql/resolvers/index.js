const { register, login } = require("./types/user");

module.exports = {
  Query: {
    user: async (_, { id }, { client }) => {
      const user = await client.getUserById(id);
      return user;
    }
  },
  Mutation: {
    register,
    login
  }
};

// TODO
// - Consider using directives for authentication
// - Implement the use of refreshTokens with accessTokens
// - Consider using cookies for authentication
