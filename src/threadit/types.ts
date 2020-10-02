import { Model } from "../datasource";
import { Request, Response } from "express";

export type Maybe<T> = T | undefined;

export interface IContext {
    models: Model,
    req: Request & Record<"user", IUserInReq>,
    res: Response
    user: IUserInReq
}

export type LimitOffSet = { offset: number, limit: number }

export interface ICount { count: string }

export interface ICommunity {
    community_id: string
    name: string
    founder_id: string
    description?: string
    created_at: string
    updated_at: string
}

export type IMutateCommunity = Pick<ICommunity, "description" | "founder_id" | "name">

export interface ICreateProfile extends IMutateProfile { user_id: string }

export interface IMutateProfile {
    name?: string,
    avatar?: string,
    bio?: string,
    location?: string,
}

export interface IProfile {
    profile_id: string,
    name: string,
    avatar: string,
    bio: string,
    location: string,
    first_setup: string,
    created_at: string,
    updated_at: string,
    user_id: string,
}

export interface IPrivateUser {
    user_id: string,
    email: string,
    username: string,
    verified: boolean,
    created_at: string,
    updated_at: string,
    password: string,
}

export type IUser = Omit<IPrivateUser, "password">;

export type IUserInReq = Omit<IUser, "created_at" | "updated_at">;

export interface IRefreshedTokens {
    token: string
    refreshToken: string
    user: IUserInReq
}
