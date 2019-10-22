// const { ForbiddenError } = require("apollo-server");
const { convertTimeToString } = require("../../helpers");

module.exports = {
  createCommunity: async (_, { name, description }, { req, client }) => {
    // Create a community as long as you are authenticated
    // isAuthenticated(req);
    const community = await client.createCommunity(name, description);
    return convertTimeToString(community);
  },
};
