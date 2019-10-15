module.exports = {
  // TODO:
  //  Authenticate all the queries and mutation here
  profile: async (_, { id }, { client }) => {
    const user = await client.getUserProfile(id);
    if (Array.isArray(user)) throw new Error("User not found!");
    return {
      ...user,
      createdAt: user.createdAt.toDateString(),
      updatedAt: user.updatedAt.toDateString()
    };
  },
  editProfile: async (_, { input }, { client }) => {
    const user = await client.editUserProfile(input);
    return {
      ...user,
      createdAt: user.createdAt.toDateString(),
      updatedAt: user.updatedAt.toDateString()
    };
  }
};
