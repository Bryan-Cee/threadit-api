import { UserInputError } from "apollo-server-express";

import { IContext, ICreateProfile, LimitOffSet } from "@threadit_types";
import { UnknownError } from "@threadit_errors";
import logger from "../../threadit/logger";

export const profile = async (obj: any, { profile_id }: { profile_id: string }, { models, user }: Pick<IContext, "models" | "user">, info: any) => {
    try {
        let profile = await models.Profile.findById(profile_id);
        if (!profile) throw new UserInputError("User not found");
        return profile
    } catch (e) {
        if (e.name === "UserInputError") return e;
        if (e.code === "22P02") {
            throw new UserInputError("profile_id input value has a problem!");
        }
        return UnknownError();
    }
};

export const profiles = async (_: any, { offset, limit }: LimitOffSet, { models, req }: IContext) => {
    try {
        return models.Profile.findAll(offset, limit);
    } catch (e) {
        console.log(e);
        return UnknownError();
    }
};

export const updateProfile = async (_: any, { data, profile_id }: { data: ICreateProfile, profile_id: string }, { models, res, req }: IContext) => {
    try {
        // TODO: validate data
        const [updatedProfile] = await models.Profile.update(data, profile_id);
        if (!updatedProfile) throw new UserInputError("User not found");
        return updatedProfile;
    }
    catch (e) {
        if (e.name === "UserInputError") return e;
        if(e.code === "22P02") {
            throw new UserInputError("profile_id input value has a problem!");
        }
        return UnknownError();
    }
};
