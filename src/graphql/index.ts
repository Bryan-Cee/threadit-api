import path from "path";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";


import resolvers from "./resolvers";
import model from "../datasource"

const typesArray = loadFilesSync(path.join(__dirname, "./typeDefs"), { extensions: ["graphql"] });
const typeDefs = mergeTypeDefs(typesArray);

export const context = async ({ req }: { req: Request }) => {
  try {
    return { req, model };
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
