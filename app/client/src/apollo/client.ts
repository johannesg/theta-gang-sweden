import { ApolloClient, HttpLink, gql, NormalizedCacheObject } from '@apollo/client'
import fetch from 'cross-fetch';

import { cache } from './cache'

export function createApolloClient(token: string) {
    return new ApolloClient({
        cache,

        link: new HttpLink({
            // uri: "http://localhost:3000",
            // uri: "https://api.thetagang.se/graphql",
            uri: process.env.API_URL,
            fetch
        }),

        headers: {
            authorization: token
        }
    });
}