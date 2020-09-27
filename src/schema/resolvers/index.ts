import { login, register } from "./user";
import { profile, profiles, updateProfile } from "./profile";
import { createCommunity } from "./community";
import { ICommunity, IContext } from "threadit/types";

const resolvers = {
  Query: {
    login,
    profile,
    profiles,
  },
  Mutation: {
    register,
    updateProfile,
    createCommunity
  },
  Community: {
    founder: async ({ founder_id: profile_id }: Partial<ICommunity>, _: any, { model, user }: Pick<IContext, "model" | "user">, info: any) => {
      if (profile_id) return profile(null, { profile_id }, { model, user }, info);
      return {};
    }
  }
};


export default resolvers;
