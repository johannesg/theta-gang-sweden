import gql from 'graphql-tag';

const QUERIES = gql`
    query Instruments {
        instruments {
            id
            name
        }
    }

    query Options($id: ID!, $type: OptionType!, $expires : String!) {
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
                    type
                    strike
                    buy
                    sell
                }
                strike
                put {
                    name
                    href
                    type
                    strike
                    buy
                    sell
                }
            }
        }
    }

    query Details($href: ID!) {
        optionDetails(id: $href) {
            last
            volume
            updated
            spread
            
            type
            optionType
            expires
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