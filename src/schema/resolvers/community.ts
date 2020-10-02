import { UserInputError } from "apollo-server-express";

import { ICommunity, IContext, IMutateCommunity } from "@threadit_types";
import { profile } from "./profile";
import { UnknownError } from "@threadit_errors";

export const createCommunity = async (parent: any, data: IMutateCommunity, { models }: IContext) => {
    // TODO: Get token from request
    try {
        const [community] = await models.Community.create(data, "c845c163-9ae7-48b8-935a-274ea790137f");
        if (community) return community;
    } catch (e) {
        if (e.code === "23505") {
            throw new UserInputError(`The name '${data.name}' already exists.`)
        }
        console.log(e);
        return UnknownError();
    }
};

export const founder = async ({ founder_id: profile_id }: Partial<ICommunity>, _: any, { models, user }: Pick<IContext, "models" | "user">, info: any) => {
    if (profile_id) return profile(null, { profile_id }, { models, user }, info);
    return {};
};
