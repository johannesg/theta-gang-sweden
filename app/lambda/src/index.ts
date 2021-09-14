import { ApolloServer } from "apollo-server-lambda"
import { createConfig } from './config';

console.log(`Starting up`);

const server = new ApolloServer(createConfig({}, './schema.graphql'));

console.log(`Init complete. Node version: ${process.version}`);

export const handler = server.createHandler({});