const { ForbiddenError } = require("apollo-server");
const { isAuthenticated, convertTimeToString } = require("../../helpers");

module.exports = {
  profile: async (_, { id }, { req, client }) => {
    // Get any user profile as long as you are authenticated
    isAuthenticated(req);

    const user = await client.getUserProfile(id);
    if (Array.isArray(user)) throw new Error("User not found!");
    return convertTimeToString(user);
  },
  editProfile: async (_, { input }, { req, client }) => {
    // Change only your profile
    const _user = isAuthenticated(req);
    if (input.userId !== _user.userId) {
      throw new ForbiddenError("You cannot edit someone else's profile");
    }
    const user = await client.editUserProfile(input);
    return convertTimeToString(user);
  },
  followProfile: async (_, { profileId }, { client, req }) => {
    const _user = isAuthenticated(req);
    const response = await client.followUserProfile(profileId, _user.userId);
    return response;
  },
};
