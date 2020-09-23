import { Model } from "../../datasource";
import { Request, Response } from "express";
import { ICreateProfile } from "../../datasource/models/Profile.model";
import { UserInputError } from "apollo-server-express";

export type Maybe<T> = T | undefined;
export interface IContext {
    model: Model,
    req: Request,
    res: Response
}
export type LimitOffSet = { offset: number, limit: number }

export const profile = async (_: any, { profile_id }: { profile_id: string }, { model, res, req }: IContext) => {
    return await model.Profile.findById(profile_id);
};

export const profiles = async (_: any, { offset, limit }: LimitOffSet, { model, req }: IContext) => {
    return await model.Profile.findAll(offset, limit);
};

export const updateProfile = async (_: any, { data, profile_id }: { data: ICreateProfile, profile_id: string }, { model, res, req }: IContext) => {
    try {
        // TODO: validate data
        const updatedProfile = await model.Profile.update(data, profile_id);
        return updatedProfile[0];
    }
    catch (e) {
        if(e.code === "22P02") {
            throw new UserInputError("profile_id input value has a problem!");
        }
    }

};
