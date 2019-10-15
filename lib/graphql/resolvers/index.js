const { register, login, forgotPassword } = require("./user");
const { profile, editProfile } = require("./profile");

module.exports = {
  Query: {
    user: async (_, { id }, { client }) => {
      const user = await client.getUserById(id);
      return user;
    },
    profile
  },
  Mutation: {
    register,
    login,
    forgotPassword,
    editProfile
  }
};

// TODO
// - Consider using directives for authentication
// - Implement the use of refreshTokens with accessTokens
// - Consider using cookies for authentication
