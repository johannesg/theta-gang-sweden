import gql from 'graphql-tag';

const QUERIES = gql`
    query getInstruments {
        instruments {
            id
            name
        }
    }

    query getOptions($id: ID!) {
        options(id: $id) {
            underlying {
                name
                href
            }
            options {
                call {
                    name
                    href
                    buyVolume
                    buy
                    sell
                    sellVolume
                }
                strike
                put {
                    name
                    href
                    buyVolume
                    buy
                    sell
                    sellVolume
                }
            }
        }

    }
`;

export const Queries = {
    QUERIES
}