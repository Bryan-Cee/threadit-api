// const { ForbiddenError } = require("apollo-server");
const isAuthenticated = require("../../auth");

module.exports = {
  createCommunity: async (_, { name, description }, { req, client }) => {
    // Create a community as long as you are authenticated
    const { userId: founderId } = await isAuthenticated(req);
    const community = await client
      .createCommunity(name, description, founderId);
    const founder = await client.getProfileById(founderId);

    return {
      ...community,
      founder
    };
  },
  communities: async (_, args, { client }) => {
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
  joinCommunity: async (_, { communityId }, { req, client }) => {
    const { userId: memberId } = await isAuthenticated(req);
    const community = await client.joinCommunity(communityId, memberId);
    return community;
  }
};
