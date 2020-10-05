import { formatError } from "apollo-errors";

require('module-alias/register');
require("dotenv").config();

import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser"
import express from "express";
import cors from "cors";

import loggerMiddleWare, { logError } from "@threadit_logger";
import { UnknownError } from "@threadit_errors";
import { IContext } from "@threadit_types";

import models from "./datasource";
import { addUser } from "./auth";
import schema from "./schema";

export const context = ({ req, res }: Partial<IContext>) => {
    const user = req?.user;
    try {
        return { req, res, user, models };
    } catch (error) {
        logError(error, "Error in context creation");
        throw UnknownError();
    }
};

// @ts-ignore
const server = new ApolloServer({ schema, context, formatError });
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: `http://localhost:${PORT}`,
    credentials: true
};

const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(addUser);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(loggerMiddleWare);

server.applyMiddleware({ app, path: "/api", cors: false });

app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
);
