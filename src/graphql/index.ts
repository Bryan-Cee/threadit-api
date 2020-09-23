import path from "path";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { AuthenticationError } from "apollo-server-express";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { Request, Response } from "express";

import resolvers from "./resolvers";
import model from "../datasource"

const typesArray = loadFilesSync(path.join(__dirname, "./typeDefs"), { extensions: ["graphql"] });
const typeDefs = mergeTypeDefs(typesArray);

interface IContext {
  req: Request,
  res: Response
}

export const context = ({ req, res }: IContext) => {
  const token = req.cookies["jwt"] || "token";

  if (!token) {
    throw new AuthenticationError("Token not provided, please log in!");
  }

  try {
    return { req, res, model };
  } catch (error) {
    console.error({ error });
    throw new AuthenticationError("Authentication token is invalid, please log in!");
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
