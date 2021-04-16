import gql from 'graphql-tag';

const QUERIES = gql`
    query Instruments {
        instruments {
            id
            name
        }
    }

    query Options($id: ID!, $type: OptionType!, $expires : String!, $includeDetails: Boolean) {
        options(id: $id, type: $type, expires: $expires, includeDetails: $includeDetails) {
            underlying {
                ...InstrumentDetails
            }
            options {
                call {
                    ...OptionInfo
                }
                callDetails {
                    ...OptionDetails
                }
                strike
                put {
                    ...OptionInfo
                }
                putDetails {
                    ...OptionDetails
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
        buyPrice
        sellPrice
        highestPrice
        lowestPrice
        updated
        totalVolumeTraded
    }

    fragment OptionInfo on OptionInfo {
        name
        href
        buyVolume
        buy
        sell
        sellVolume
    }

    fragment OptionDetails on OptionDetails {
        expires
        type
        optionType
        strike
        parity
        buyIV
        delta
        gamma
        theta
        vega
        sellIV
        IV
    }
`;

export const Queries = {
    QUERIES
}