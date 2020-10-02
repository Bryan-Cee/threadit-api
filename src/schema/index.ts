import path from "path";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";

import resolvers from "./resolvers";

const typesArray = loadFilesSync(path.join(__dirname, "./typeDefs"), { extensions: ["graphql"] });
const typeDefs = mergeTypeDefs(typesArray);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
