import gql from 'graphql-tag';

const QUERIES = gql`
    query getInstruments {
        instruments {
            id
            name
        }
    }

    query getOptions($id: ID!, $type: OptionType!, $expires : String!) {
        options(id: $id, type: $type, expires: $expires) {
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