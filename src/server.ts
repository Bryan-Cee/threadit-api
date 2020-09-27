require("dotenv").config();

import jwt from "jsonwebtoken"
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser"
import express, { Request, Response } from "express";
import cors from "cors";

import schema, { context } from "./schema";
import models, { Model } from "./datasource";
import { IRefreshedTokens, IUserInReq } from "threadit/types";

const server = new ApolloServer({ schema, context });
const PORT = process.env.PORT || 3000;
const SECRET = process.env.SECRET_KEY || "a-strong-key";
const REFRESH_KEY = process.env.REFRESH_KEY || "a-strong-key";
const corsOptions = {
    origin: `http://localhost:${PORT}`,
    credentials: true
};

const createTokens = async (user: IUserInReq, SECRET: string, REFRESH_KEY: string): Promise<string[]> => {
    const createToken = jwt.sign({ user: user }, SECRET, { expiresIn: "1m"});
    const createRefreshToken = jwt.sign({ user: user }, REFRESH_KEY, { expiresIn: "7d" });
    return Promise.all([createToken, createRefreshToken]);
};

const refreshTokens = async (token: string, refreshToken: string, models: Model, SECRET: string, REFRESH_KEY: string): Promise<Partial<IRefreshedTokens>> => {
    try {
        const { user: { user_id }}: any = jwt.decode(refreshToken);
        if (!user_id) return {};

        const _user = await models.User.findByIdOrEmailUnsafe(user_id);
        if (!_user) return {};

        const refreshSecret = REFRESH_KEY + _user.password;

        jwt.verify(refreshToken, refreshSecret);
        const user: IUserInReq = {
            user_id: _user.user_id,
            email: _user.email,
            username: _user.username,
            verified: _user.verified
        };
        const [newToken, newRefreshToken] = await createTokens(user, SECRET, refreshSecret);

        return {
            token: newToken,
            refreshToken: newRefreshToken,
            user,
        };
    } catch (error) {
        return {};
    }
};

const addUser = async (req: Request & Record<"user", IUserInReq | undefined>, res: Response, next: any) => {
    const token = req.cookies.token;
    if (!token) return next();

    try {
        const { user }: any = jwt.verify(token, SECRET);
        req.user = user;
    } catch (error) {
        console.log({ error });
        const refreshToken = req.cookies["refresh-token"];
        if (!refreshToken) return next();

        const newToken = await refreshTokens(token, refreshToken, models, SECRET, REFRESH_KEY);
        if (newToken.token && newToken.refreshToken) {
            res.cookie("token", newToken.token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
            res.cookie("refresh-token", newToken.refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true })
        }
        req.user = newToken.user;
    }
    return next();
};

const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());
// @ts-ignore
app.use(addUser);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

server.applyMiddleware({ app, path: "/api" ,cors: false });

app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
);
