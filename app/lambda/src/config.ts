import { Config } from 'apollo-server'
import { readFileSync } from 'fs';

import { resolvers } from './resolvers'

export interface ApolloContext {
    context: any
    event: any
}

export function createConfig(env: any, schemaPath: string): Config {
    const typeDefs = readFileSync(schemaPath, 'utf-8');

    return {
        typeDefs,
        resolvers,
        dataSources: () => {
            return {
                // DynamoDB: new DynamoDBDataSource()
            }
        },
        context: (ctx: ApolloContext) => {
            return {
            };
        },
        plugins: []

    };
}