const { ForbiddenError } = require("apollo-server");
const { isAuthenticated } = require("../../helpers");

module.exports = {
  profile: async (_, { id }, { req, client }) => {
    // Get any user profile as long as you are authenticated
    isAuthenticated(req);

    const user = await client.getUserProfile(id);
    if (Array.isArray(user)) throw new Error("User not found!");
    return {
      ...user,
      createdAt: user.createdAt.toDateString(),
      updatedAt: user.updatedAt.toDateString()
    };
  },
  editProfile: async (_, { input }, { req, client }) => {
    // Change only your profile
    const _user = isAuthenticated(req);
    if (input.userId !== _user.userId) {
      throw new ForbiddenError("You cannot edit someone else's profile");
    }
    const user = await client.editUserProfile(input);
    return {
      ...user,
      createdAt: user.createdAt.toDateString(),
      updatedAt: user.updatedAt.toDateString()
    };
  }
};
