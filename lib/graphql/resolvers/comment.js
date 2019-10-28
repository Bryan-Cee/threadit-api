const { UserInputError } = require("apollo-server");
const { isAuthenticated } = require("../../helpers");

module.exports = {
  createComment: async (_, { message, postId }, { client, req }) => {
    if (!message.trim()) {
      throw new UserInputError("You can not post an empty comment!");
    }
    const { userId: authorId } = isAuthenticated(req);
    const comment = await client.createComment(message, authorId, postId);
    return comment;
  },
};
