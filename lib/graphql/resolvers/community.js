// const { ForbiddenError } = require("apollo-server");
const { isAuthenticated } = require("../../helpers");

module.exports = {
  createCommunity: async (_, { name, description }, { req, client }) => {
    // Create a community as long as you are authenticated
    const { userId: founderId } = isAuthenticated(req);
    const community = await client
      .createCommunity(name, description, founderId);
    const founder = await client.getProfileById(founderId);

    return {
      ...community,
      founder
    };
  },
};
