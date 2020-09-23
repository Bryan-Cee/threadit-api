require("dotenv").config();

import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser"
import express from "express";
import cors from "cors";

import schema, { context } from "./graphql";

const server = new ApolloServer({ schema, context });
const PORT = process.env.PORT || 3000;
const corsOptions = {
    origin: `http://localhost:${PORT}`,
    credentials: true
};

const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

server.applyMiddleware({ app, path: "/api" ,cors: false });

app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
);
