// const { ForbiddenError } = require("apollo-server");
const { convertTimeToString, isAuthenticated } = require("../../helpers");

module.exports = {
  createCommunity: async (_, { name, description }, { req, client }) => {
    // Create a community as long as you are authenticated
    const { userId: founderId } = isAuthenticated(req);
    const community = await client
      .createCommunity(name, description, founderId);
    return convertTimeToString(community);
  },
};
