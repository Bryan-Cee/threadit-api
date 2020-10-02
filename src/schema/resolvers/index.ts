import { profile, profiles, updateProfile } from "./profile";
import { createCommunity, founder } from "./community";
import { isAuthenticatedResolver } from "./base";
import { login, register } from "./user";

const resolvers = {
  Query: {
    login,
    profile: isAuthenticatedResolver.createResolver(profile),
    profiles: isAuthenticatedResolver.createResolver(profiles),
  },
  Mutation: {
    register,
    updateProfile: isAuthenticatedResolver.createResolver(updateProfile),
    createCommunity: isAuthenticatedResolver.createResolver(createCommunity)
  },
  Community: {
    founder
  }
};


export default resolvers;
