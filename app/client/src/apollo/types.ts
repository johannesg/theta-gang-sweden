/* eslint-disable */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export enum CallOrPutType {
  Call = 'CALL',
  Put = 'PUT'
}

export type Instrument = {
  __typename?: 'Instrument';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type InstrumentDetails = {
  __typename?: 'InstrumentDetails';
  name: Scalars['String'];
  href: Scalars['String'];
  change: Maybe<Scalars['Float']>;
  changePercent: Maybe<Scalars['Float']>;
  buyPrice: Maybe<Scalars['Float']>;
  sellPrice: Maybe<Scalars['Float']>;
  lastPrice: Maybe<Scalars['Float']>;
  highestPrice: Maybe<Scalars['Float']>;
  lowestPrice: Maybe<Scalars['Float']>;
  updated: Maybe<Scalars['String']>;
  totalVolumeTraded: Maybe<Scalars['Int']>;
};

export type OptionDetails = {
  __typename?: 'OptionDetails';
  name: Maybe<Scalars['String']>;
  href: Maybe<Scalars['String']>;
  type: Maybe<CallOrPutType>;
  strike: Maybe<Scalars['Float']>;
  changePercent: Maybe<Scalars['Float']>;
  change: Maybe<Scalars['Float']>;
  bid: Maybe<Scalars['Float']>;
  ask: Maybe<Scalars['Float']>;
  spread: Maybe<Scalars['Float']>;
  last: Maybe<Scalars['Float']>;
  high: Maybe<Scalars['Float']>;
  low: Maybe<Scalars['Float']>;
  volume: Maybe<Scalars['Int']>;
  updated: Maybe<Scalars['String']>;
  expires: Maybe<Scalars['String']>;
  optionType: Maybe<OptionType>;
  parity: Maybe<Scalars['Int']>;
  buyIV: Maybe<Scalars['Float']>;
  delta: Maybe<Scalars['Float']>;
  theta: Maybe<Scalars['Float']>;
  vega: Maybe<Scalars['Float']>;
  sellIV: Maybe<Scalars['Float']>;
  gamma: Maybe<Scalars['Float']>;
  rho: Maybe<Scalars['Float']>;
  IV: Maybe<Scalars['Float']>;
};

export type OptionMatrixItem = {
  __typename?: 'OptionMatrixItem';
  call: Maybe<OptionDetails>;
  strike: Maybe<Scalars['Float']>;
  put: Maybe<OptionDetails>;
};

export enum OptionType {
  Weekly = 'WEEKLY',
  Standard = 'STANDARD'
}

export type OptionsList = {
  __typename?: 'OptionsList';
  underlying: Maybe<InstrumentDetails>;
  options: Maybe<Array<Maybe<OptionMatrixItem>>>;
};

export type OptionsMatrix = {
  __typename?: 'OptionsMatrix';
  underlying: Maybe<InstrumentDetails>;
  matrix: Array<OptionsWithExpiry>;
};

export type OptionsWithExpiry = {
  __typename?: 'OptionsWithExpiry';
  expires: Scalars['String'];
  options: Array<OptionMatrixItem>;
};

export type Query = {
  __typename?: 'Query';
  instruments: Maybe<Array<Maybe<Instrument>>>;
  matrix: Maybe<OptionsMatrix>;
  optionDetails: Maybe<OptionDetails>;
};


export type QueryMatrixArgs = {
  id: Scalars['ID'];
  type: OptionType;
  expires: Scalars['String'];
  includeDetails: Maybe<Scalars['Boolean']>;
};


export type QueryOptionDetailsArgs = {
  id: Scalars['ID'];
};

export type InstrumentsQueryVariables = Exact<{ [key: string]: never; }>;


export type InstrumentsQuery = (
  { __typename?: 'Query' }
  & { instruments: Maybe<Array<Maybe<(
    { __typename?: 'Instrument' }
    & Pick<Instrument, 'id' | 'name'>
  )>>> }
);

export type OptionsQueryVariables = Exact<{
  id: Scalars['ID'];
  type: OptionType;
  expires: Scalars['String'];
  includeDetails: Maybe<Scalars['Boolean']>;
}>;


export type OptionsQuery = (
  { __typename?: 'Query' }
  & { matrix: Maybe<(
    { __typename?: 'OptionsMatrix' }
    & { underlying: Maybe<(
      { __typename?: 'InstrumentDetails' }
      & InstrumentDetailsFragment
    )>, matrix: Array<(
      { __typename?: 'OptionsWithExpiry' }
      & Pick<OptionsWithExpiry, 'expires'>
      & { options: Array<(
        { __typename?: 'OptionMatrixItem' }
        & Pick<OptionMatrixItem, 'strike'>
        & { call: Maybe<(
          { __typename?: 'OptionDetails' }
          & OptionDetailsFragment
        )>, put: Maybe<(
          { __typename?: 'OptionDetails' }
          & OptionDetailsFragment
        )> }
      )> }
    )> }
  )> }
);

export type DetailsQueryVariables = Exact<{
  href: Scalars['ID'];
}>;


export type DetailsQuery = (
  { __typename?: 'Query' }
  & { optionDetails: Maybe<(
    { __typename?: 'OptionDetails' }
    & OptionDetailsFragment
  )> }
);

export type InstrumentDetailsFragment = (
  { __typename?: 'InstrumentDetails' }
  & Pick<InstrumentDetails, 'name' | 'href' | 'change' | 'changePercent' | 'lastPrice' | 'buyPrice' | 'sellPrice' | 'highestPrice' | 'lowestPrice' | 'updated' | 'totalVolumeTraded'>
);

export type OptionDetailsFragment = (
  { __typename?: 'OptionDetails' }
  & Pick<OptionDetails, 'name' | 'href' | 'type' | 'strike' | 'changePercent' | 'change' | 'updated' | 'bid' | 'ask' | 'spread' | 'last' | 'high' | 'low' | 'volume' | 'expires' | 'optionType' | 'parity' | 'buyIV' | 'delta' | 'theta' | 'vega' | 'sellIV' | 'gamma' | 'rho' | 'IV'>
);

export const InstrumentDetailsFragmentDoc = gql`
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
    `;
export const OptionDetailsFragmentDoc = gql`
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
  buyIV
  delta
  theta
  vega
  sellIV
  gamma
  rho
  IV
}
    `;
export const InstrumentsDocument = gql`
    query Instruments {
  instruments {
    id
    name
  }
}
    `;

/**
 * __useInstrumentsQuery__
 *
 * To run a query within a React component, call `useInstrumentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useInstrumentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInstrumentsQuery({
 *   variables: {
 *   },
 * });
 */
export function useInstrumentsQuery(baseOptions?: Apollo.QueryHookOptions<InstrumentsQuery, InstrumentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InstrumentsQuery, InstrumentsQueryVariables>(InstrumentsDocument, options);
      }
export function useInstrumentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InstrumentsQuery, InstrumentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InstrumentsQuery, InstrumentsQueryVariables>(InstrumentsDocument, options);
        }
export type InstrumentsQueryHookResult = ReturnType<typeof useInstrumentsQuery>;
export type InstrumentsLazyQueryHookResult = ReturnType<typeof useInstrumentsLazyQuery>;
export type InstrumentsQueryResult = Apollo.QueryResult<InstrumentsQuery, InstrumentsQueryVariables>;
export const OptionsDocument = gql`
    query Options($id: ID!, $type: OptionType!, $expires: String!, $includeDetails: Boolean) {
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
    ${InstrumentDetailsFragmentDoc}
${OptionDetailsFragmentDoc}`;

/**
 * __useOptionsQuery__
 *
 * To run a query within a React component, call `useOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOptionsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      type: // value for 'type'
 *      expires: // value for 'expires'
 *      includeDetails: // value for 'includeDetails'
 *   },
 * });
 */
export function useOptionsQuery(baseOptions: Apollo.QueryHookOptions<OptionsQuery, OptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OptionsQuery, OptionsQueryVariables>(OptionsDocument, options);
      }
export function useOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OptionsQuery, OptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OptionsQuery, OptionsQueryVariables>(OptionsDocument, options);
        }
export type OptionsQueryHookResult = ReturnType<typeof useOptionsQuery>;
export type OptionsLazyQueryHookResult = ReturnType<typeof useOptionsLazyQuery>;
export type OptionsQueryResult = Apollo.QueryResult<OptionsQuery, OptionsQueryVariables>;
export const DetailsDocument = gql`
    query Details($href: ID!) {
  optionDetails(id: $href) {
    ...OptionDetails
  }
}
    ${OptionDetailsFragmentDoc}`;

/**
 * __useDetailsQuery__
 *
 * To run a query within a React component, call `useDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDetailsQuery({
 *   variables: {
 *      href: // value for 'href'
 *   },
 * });
 */
export function useDetailsQuery(baseOptions: Apollo.QueryHookOptions<DetailsQuery, DetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DetailsQuery, DetailsQueryVariables>(DetailsDocument, options);
      }
export function useDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DetailsQuery, DetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DetailsQuery, DetailsQueryVariables>(DetailsDocument, options);
        }
export type DetailsQueryHookResult = ReturnType<typeof useDetailsQuery>;
export type DetailsLazyQueryHookResult = ReturnType<typeof useDetailsLazyQuery>;
export type DetailsQueryResult = Apollo.QueryResult<DetailsQuery, DetailsQueryVariables>;