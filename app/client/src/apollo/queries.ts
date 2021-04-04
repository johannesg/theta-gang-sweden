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
                change
                changePercent
                buyPrice
                sellPrice
                lastPrice
                highestPrice
                lowestPrice
                updated
                totalVolumeTraded
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

    query Greeks($href: ID!) {
        optionDetails(id: $href) {
            buyIV
            delta
            gamma
            theta
            vega
            sellIV
            IV
        }
    }
`;

export const Queries = {
    QUERIES
}