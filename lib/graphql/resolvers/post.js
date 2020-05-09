const { ForbiddenError } = require("apollo-server");
const isAuthenticated = require("../../auth");

module.exports = {
  createPost: async (_, { content, communityId }, { req, client }) => {
    // Create a community as long as you are authenticated
    const { user: { profileId } } = await isAuthenticated(req);
    const data = await client.getCommunityMemberId(profileId, communityId);
    if (Array.isArray(data)) {
      throw new ForbiddenError(
        "You cannot post in a community you do not belong to!"
      );
    }
    const authorCommunity = +data.id;
    const post = await client.createPost(content, authorCommunity);
    // Resolving the community
    const community = await client.getCommunityById(communityId);

    // Resolving founder and author
    const [founder, author] = await Promise.all([
      client.getProfileById(community.founderId),
      client.getProfileById(profileId)
    ]);

    community.founder = founder;

    return {
      ...post,
      community,
      author,
    };
  },
};
