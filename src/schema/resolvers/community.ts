import { UserInputError } from "apollo-server-express";

import { ICommunity, IContext, IMutateCommunity } from "@threadit_types";
import { profile } from "./profile";
import { UnknownError, UserNotFound } from "@threadit_errors";
// import { logError } from "@threadit_logger";

export const createCommunity = async (parent: any, data: IMutateCommunity, { models, user }: IContext) => {
    try {
        const [community] = await models.Community.create(data, user.profile_id);
        if (community) return community;
    } catch (e) {
        if (e.code === "23505") {
            throw new UserInputError(`The name '${data.name}' already exists.`)
        }
        // logError(e, "Error in creating community");
        throw UnknownError();
    }
};

export const founder = async ({ founder_id: profile_id }: Partial<ICommunity>, _: any, { models, user }: Pick<IContext, "models" | "user">, info: any) => {
    try {
        if (profile_id) return profile(null, { profile_id }, { models, user }, info);
        return {};
    } catch (e) {
        // logError(e, "Error in getting founder");
        return UserNotFound();
    }

};
