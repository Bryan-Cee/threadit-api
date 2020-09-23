import { login, register } from "./user";
import { profile, profiles, updateProfile } from "./profile";

const resolvers = {
  Query: {
    login,
    profile,
    profiles,
  },
  Mutation: {
    register,
    updateProfile
  }
};


export default resolvers;
