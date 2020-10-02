require('module-alias/register');
require("dotenv").config();

import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser"
import express from "express";
import cors from "cors";

import { IContext } from "@threadit_types";
import { UnknownError } from "@threadit_errors";
import models from "./datasource";
import schema from "./schema";
import { addUser } from "./auth";

export const context = ({ req, res }: Partial<IContext>) => {
    const user = req?.user;

    try {
        return { req, res, user, models };
    } catch (error) {
        console.error({ error });
        throw new UnknownError();
    }
};

const server = new ApolloServer({ schema, context });
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: `http://localhost:${PORT}`,
    credentials: true
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
