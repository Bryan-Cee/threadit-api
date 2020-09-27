import path from "path";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";

import { IContext } from "threadit/types";
import { UnknownError } from "../types/errors";

import resolvers from "./resolvers";
import model from "../datasource"

const typesArray = loadFilesSync(path.join(__dirname, "./typeDefs"), { extensions: ["graphql"] });
const typeDefs = mergeTypeDefs(typesArray);

export const context = ({ req, res }: Partial<IContext>) => {
  const user = req?.user;

  try {
    return { req, res, user, model };
  } catch (error) {
    console.error({ error });
    throw new UnknownError("Authentication token is invalid, please log in!");
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
