import gql from 'graphql-tag';

const QUERIES = gql`
    query Instruments {
        instruments {
            id
            name
        }
    }

    query Options($id: ID!, $type: OptionType!, $expires : String!, $includeDetails: Boolean) {
        matrix(id: $id, type: $type, expires: $expires, includeDetails: $includeDetails) {
            underlying {
                ...InstrumentDetails
            }
            matrix {
                expires
                options {
                    call {
                    ...OptionDetails
                    }
                    strike
                    put {
                    ...OptionDetails
                    }
                }
            }
        }
    }

    query Details($href: ID!) {
        optionDetails(id: $href) {
            ...OptionDetails
        }
    }

    fragment InstrumentDetails on InstrumentDetails {
        name
        href
        change
        changePercent
        lastPrice
        buyPrice
        sellPrice
        highestPrice
        lowestPrice
        updated
        totalVolumeTraded
    }

    fragment OptionDetails on OptionDetails {
        name
        href
        type
        strike
        changePercent
        change
        updated
        bid
        ask
        spread
        last
        high
        low
        volume
        expires
        optionType
        type
        strike
        parity
        delta
        theta
        vega
        gamma
        rho
        IV
    }
`;

export const Queries = {
    QUERIES
}