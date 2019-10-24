const { ForbiddenError } = require("apollo-server");
const { isAuthenticated } = require("../../helpers");

module.exports = {
  createPost: async (_, { content, communityId }, { req, client }) => {
    // Create a community as long as you are authenticated
    const { userId: profileId } = isAuthenticated(req);

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
    // Resolving the author
    const author = await client.getProfileById(profileId);

    return {
      ...post,
      community,
      author,
    };
  },
};
