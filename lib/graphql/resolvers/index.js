const { register, login, resetRequest } = require("./user");
const { profile, editProfile, followProfile } = require("./profile");
const { createCommunity, communities, joinCommunity } = require("./community");
const { createPost } = require("./post");
const { createComment, commentAdded } = require("./comment");

module.exports = {
  Query: {
    communities,
    profile
  },
  Mutation: {
    createComment,
    createCommunity,
    createPost,
    editProfile,
    followProfile,
    joinCommunity,
    login,
    register,
    resetRequest,
  },
  Subscription: {
    commentAdded,
  }
};

// TODO
// - Consider using directives for authentication
// - Implement the use of refreshTokens with accessTokens
// - Consider using cookies for authentication
