import { UserInputError } from "apollo-server-express";
import { IContext, ICreateProfile, LimitOffSet } from "threadit/types";
import { isAuthenticatedResolver } from "./base";

export const profile = isAuthenticatedResolver.createResolver(
  async (obj: any, { profile_id }: { profile_id: string }, { model, user }: Pick<IContext, "model" | "user">) => {
      console.log("User in profile: ", user);
      try {
          let profile = await model.Profile.findById(profile_id);
          if (!profile) throw new UserInputError("User not found");
          return profile
      } catch (e) {
          if (e.name === "UserInputError") return e;
          if (e.code === "22P02") {
              throw new UserInputError("profile_id input value has a problem!");
          }
      }
  }
);

export const profiles = async (_: any, { offset, limit }: LimitOffSet, { model, req }: IContext) => {
    return model.Profile.findAll(offset, limit);
};

export const updateProfile = async (_: any, { data, profile_id }: { data: ICreateProfile, profile_id: string }, { model, res, req }: IContext) => {
    try {
        // TODO: validate data
        const [updatedProfile] = await model.Profile.update(data, profile_id);
        if (!updatedProfile) throw new UserInputError("User not found");
        return updatedProfile;
    }
    catch (e) {
        if (e.name === "UserInputError") return e;
        if(e.code === "22P02") {
            throw new UserInputError("profile_id input value has a problem!");
        }
    }
};
