import { UserInputError } from "apollo-server-express";
import { IContext, IMutateCommunity } from "threadit/types";

export const createCommunity = async (parent: any, data: IMutateCommunity, { model }: IContext) => {
    // TODO: Get token from request
    try {
        const [community] = await model.Community.create(data, "c845c163-9ae7-48b8-935a-274ea790137f");
        if (community) return community;
    } catch (e) {
        if (e.code === "23505") {
            throw new UserInputError(`The name '${data.name}' already exists.`)
        }
        return e;
    }
};

export const founder = (parent: any) => {
    console.log({ parent });
    return {}
};
