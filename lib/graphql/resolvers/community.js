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
  communities: async (_, args, { req, client }) => {
    const { after, first } = args;
    const _communities = await client.getCommunityList(after, first);
    const communities = {
      count: _communities.count,
      communities: _communities.communities.map(async community => {
        community.founder = await client.getProfileById(community.founderId);
        delete community.founderId;
        return community;
      })
    };
    return communities;
  },
};
