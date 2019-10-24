const { register, login, resetRequest } = require("./user");
const { profile, editProfile, followProfile } = require("./profile");
const { createCommunity, communities } = require("./community");
const { createPost } = require("./post");

module.exports = {
  Query: {
    communities,
    profile
  },
  Mutation: {
    createCommunity,
    createPost,
    editProfile,
    followProfile,
    login,
    register,
    resetRequest,
  }
};

// TODO
// - Consider using directives for authentication
// - Implement the use of refreshTokens with accessTokens
// - Consider using cookies for authentication
