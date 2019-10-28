const { UserInputError } = require("apollo-server");
const { isAuthenticated } = require("../../helpers");

module.exports = {
  commentAdded: {
    subscribe: async (_, { postId }, { client, pubsub }) => {
      const post = await client.getPost(postId);
      if (!post) throw new Error("Post not found!");
      return pubsub.asyncIterator(`POST_COMMENTS_${postId}`);
    },
  },
  createComment: async (_, { message, postId }, { client, req, pubsub }) => {
    if (!message.trim()) {
      throw new UserInputError("You can not post an empty comment!");
    }
    const { userId: authorId } = isAuthenticated(req);
    const commentAdded = await client.createComment(message, authorId, postId);
    pubsub.publish(`POST_COMMENTS_${postId}`, { commentAdded });
    return commentAdded;
  },
};
