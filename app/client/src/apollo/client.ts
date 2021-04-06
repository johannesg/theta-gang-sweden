import { ApolloClient, HttpLink, gql, NormalizedCacheObject } from '@apollo/client'
import fetch from 'cross-fetch';

import { cache } from './cache'

export function createApolloClient(token: string) {
    return new ApolloClient({
        cache,
        // uri: "https://catsapi.aws.jogus.io/graphql",

        link: new HttpLink({
            // uri: "http://localhost:3000",
            // uri: "https://0iw6snlkp7.execute-api.eu-north-1.amazonaws.com/graphql",
            uri: "https://i0l6ot66ai.execute-api.eu-north-1.amazonaws.com/graphql",
            fetch
        }),

        headers: {
            authorization: token
        }
    });
}
    
