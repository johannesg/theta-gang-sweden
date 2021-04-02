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

export type CallOrPut = {
  __typename?: 'CallOrPut';
  name: Scalars['String'];
  href: Scalars['String'];
  buyVolume: Maybe<Scalars['Int']>;
  buy: Maybe<Scalars['Float']>;
  sell: Maybe<Scalars['Float']>;
  sellVolume: Maybe<Scalars['Int']>;
};

export type Instrument = {
  __typename?: 'Instrument';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type InstrumentDetails = {
  __typename?: 'InstrumentDetails';
  name: Scalars['String'];
  href: Scalars['String'];
};

export type OptionDetails = {
  __typename?: 'OptionDetails';
  buyIV: Maybe<Scalars['String']>;
  delta: Maybe<Scalars['Float']>;
  theta: Maybe<Scalars['Float']>;
  vega: Maybe<Scalars['Float']>;
  sellIV: Maybe<Scalars['String']>;
  gamma: Maybe<Scalars['Float']>;
  rho: Maybe<Scalars['Float']>;
  IV: Maybe<Scalars['String']>;
};

export type OptionInfo = {
  __typename?: 'OptionInfo';
  call: Maybe<CallOrPut>;
  strike: Maybe<Scalars['Float']>;
  put: Maybe<CallOrPut>;
};

export type OptionsList = {
  __typename?: 'OptionsList';
  underlying: Maybe<InstrumentDetails>;
  options: Maybe<Array<Maybe<OptionInfo>>>;
};

export type Query = {
  __typename?: 'Query';
  instruments: Maybe<Array<Maybe<Instrument>>>;
  options: Maybe<OptionsList>;
  optionDetails: Maybe<OptionDetails>;
};


export type QueryOptionsArgs = {
  id: Scalars['ID'];
};


export type QueryOptionDetailsArgs = {
  id: Scalars['ID'];
};

export type GetInstrumentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInstrumentsQuery = (
  { __typename?: 'Query' }
  & { instruments: Maybe<Array<Maybe<(
    { __typename?: 'Instrument' }
    & Pick<Instrument, 'id' | 'name'>
  )>>> }
);

export type GetOptionsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetOptionsQuery = (
  { __typename?: 'Query' }
  & { options: Maybe<(
    { __typename?: 'OptionsList' }
    & { underlying: Maybe<(
      { __typename?: 'InstrumentDetails' }
      & Pick<InstrumentDetails, 'name' | 'href'>
    )>, options: Maybe<Array<Maybe<(
      { __typename?: 'OptionInfo' }
      & Pick<OptionInfo, 'strike'>
      & { call: Maybe<(
        { __typename?: 'CallOrPut' }
        & Pick<CallOrPut, 'name' | 'href' | 'buyVolume' | 'buy' | 'sell' | 'sellVolume'>
      )>, put: Maybe<(
        { __typename?: 'CallOrPut' }
        & Pick<CallOrPut, 'name' | 'href' | 'buyVolume' | 'buy' | 'sell' | 'sellVolume'>
      )> }
    )>>> }
  )> }
);


export const GetInstrumentsDocument = gql`
    query getInstruments {
  instruments {
    id
    name
  }
}
    `;

/**
 * __useGetInstrumentsQuery__
 *
 * To run a query within a React component, call `useGetInstrumentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInstrumentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInstrumentsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetInstrumentsQuery(baseOptions?: Apollo.QueryHookOptions<GetInstrumentsQuery, GetInstrumentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInstrumentsQuery, GetInstrumentsQueryVariables>(GetInstrumentsDocument, options);
      }
export function useGetInstrumentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInstrumentsQuery, GetInstrumentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInstrumentsQuery, GetInstrumentsQueryVariables>(GetInstrumentsDocument, options);
        }
export type GetInstrumentsQueryHookResult = ReturnType<typeof useGetInstrumentsQuery>;
export type GetInstrumentsLazyQueryHookResult = ReturnType<typeof useGetInstrumentsLazyQuery>;
export type GetInstrumentsQueryResult = Apollo.QueryResult<GetInstrumentsQuery, GetInstrumentsQueryVariables>;
export const GetOptionsDocument = gql`
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

/**
 * __useGetOptionsQuery__
 *
 * To run a query within a React component, call `useGetOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOptionsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetOptionsQuery(baseOptions: Apollo.QueryHookOptions<GetOptionsQuery, GetOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOptionsQuery, GetOptionsQueryVariables>(GetOptionsDocument, options);
      }
export function useGetOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOptionsQuery, GetOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOptionsQuery, GetOptionsQueryVariables>(GetOptionsDocument, options);
        }
export type GetOptionsQueryHookResult = ReturnType<typeof useGetOptionsQuery>;
export type GetOptionsLazyQueryHookResult = ReturnType<typeof useGetOptionsLazyQuery>;
export type GetOptionsQueryResult = Apollo.QueryResult<GetOptionsQuery, GetOptionsQueryVariables>;