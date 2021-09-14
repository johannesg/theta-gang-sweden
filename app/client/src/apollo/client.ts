import { ApolloClient, HttpLink, gql, NormalizedCacheObject } from '@apollo/client'
import fetch from 'cross-fetch';

import { cache } from './cache'

let _baseUrl = "";

export function configure({ baseUrl }: { baseUrl: string}) {
    _baseUrl = baseUrl;
}

export function createApolloClient(token: string) {
    return new ApolloClient({
        cache,

        link: new HttpLink({
            uri: _baseUrl,
            fetch
        }),

        headers: {
            authorization: token
        }
    });
}