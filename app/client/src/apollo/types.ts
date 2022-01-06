/* eslint-disable */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
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
  buyPrice: Maybe<Scalars['Float']>;
  change: Maybe<Scalars['Float']>;
  changePercent: Maybe<Scalars['Float']>;
  highestPrice: Maybe<Scalars['Float']>;
  href: Scalars['String'];
  lastPrice: Maybe<Scalars['Float']>;
  lowestPrice: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  sellPrice: Maybe<Scalars['Float']>;
  totalVolumeTraded: Maybe<Scalars['Int']>;
  updated: Maybe<Scalars['String']>;
};

export type OptionDetails = {
  __typename?: 'OptionDetails';
  IV: Maybe<Scalars['Float']>;
  ask: Maybe<Scalars['Float']>;
  bid: Maybe<Scalars['Float']>;
  change: Maybe<Scalars['Float']>;
  changePercent: Maybe<Scalars['Float']>;
  delta: Maybe<Scalars['Float']>;
  expires: Maybe<Scalars['String']>;
  gamma: Maybe<Scalars['Float']>;
  high: Maybe<Scalars['Float']>;
  href: Maybe<Scalars['String']>;
  interest: Maybe<Scalars['Float']>;
  last: Maybe<Scalars['Float']>;
  low: Maybe<Scalars['Float']>;
  name: Maybe<Scalars['String']>;
  optionType: Maybe<OptionType>;
  parity: Maybe<Scalars['Int']>;
  rho: Maybe<Scalars['Float']>;
  spread: Maybe<Scalars['Float']>;
  strike: Maybe<Scalars['Float']>;
  theta: Maybe<Scalars['Float']>;
  type: Maybe<CallOrPutType>;
  updated: Maybe<Scalars['String']>;
  vega: Maybe<Scalars['Float']>;
  volume: Maybe<Scalars['Int']>;
};

export type OptionMatrixItem = {
  __typename?: 'OptionMatrixItem';
  call: Maybe<OptionDetails>;
  put: Maybe<OptionDetails>;
  strike: Maybe<Scalars['Float']>;
};

export enum OptionType {
  Standard = 'STANDARD',
  Weekly = 'WEEKLY'
}

export type OptionsList = {
  __typename?: 'OptionsList';
  options: Maybe<Array<Maybe<OptionMatrixItem>>>;
  underlying: Maybe<InstrumentDetails>;
};

export type OptionsMatrix = {
  __typename?: 'OptionsMatrix';
  matrix: Array<OptionsWithExpiry>;
  underlying: Maybe<InstrumentDetails>;
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
  expires: Scalars['String'];
  id: Scalars['ID'];
  includeDetails: Maybe<Scalars['Boolean']>;
  type: OptionType;
};


export type QueryOptionDetailsArgs = {
  id: Scalars['ID'];
};

export type InstrumentsQueryVariables = Exact<{ [key: string]: never; }>;


export type InstrumentsQuery = { __typename?: 'Query', instruments: Maybe<Array<Maybe<{ __typename?: 'Instrument', id: string, name: string }>>> };

export type OptionsQueryVariables = Exact<{
  id: Scalars['ID'];
  type: OptionType;
  expires: Scalars['String'];
  includeDetails: Maybe<Scalars['Boolean']>;
}>;


export type OptionsQuery = { __typename?: 'Query', matrix: Maybe<{ __typename?: 'OptionsMatrix', underlying: Maybe<{ __typename?: 'InstrumentDetails', name: string, href: string, change: Maybe<number>, changePercent: Maybe<number>, lastPrice: Maybe<number>, buyPrice: Maybe<number>, sellPrice: Maybe<number>, highestPrice: Maybe<number>, lowestPrice: Maybe<number>, updated: Maybe<string>, totalVolumeTraded: Maybe<number> }>, matrix: Array<{ __typename?: 'OptionsWithExpiry', expires: string, options: Array<{ __typename?: 'OptionMatrixItem', strike: Maybe<number>, call: Maybe<{ __typename?: 'OptionDetails', name: Maybe<string>, href: Maybe<string>, type: Maybe<CallOrPutType>, strike: Maybe<number>, changePercent: Maybe<number>, change: Maybe<number>, updated: Maybe<string>, bid: Maybe<number>, ask: Maybe<number>, spread: Maybe<number>, last: Maybe<number>, high: Maybe<number>, low: Maybe<number>, volume: Maybe<number>, expires: Maybe<string>, optionType: Maybe<OptionType>, parity: Maybe<number>, delta: Maybe<number>, theta: Maybe<number>, vega: Maybe<number>, gamma: Maybe<number>, rho: Maybe<number>, IV: Maybe<number> }>, put: Maybe<{ __typename?: 'OptionDetails', name: Maybe<string>, href: Maybe<string>, type: Maybe<CallOrPutType>, strike: Maybe<number>, changePercent: Maybe<number>, change: Maybe<number>, updated: Maybe<string>, bid: Maybe<number>, ask: Maybe<number>, spread: Maybe<number>, last: Maybe<number>, high: Maybe<number>, low: Maybe<number>, volume: Maybe<number>, expires: Maybe<string>, optionType: Maybe<OptionType>, parity: Maybe<number>, delta: Maybe<number>, theta: Maybe<number>, vega: Maybe<number>, gamma: Maybe<number>, rho: Maybe<number>, IV: Maybe<number> }> }> }> }> };

export type DetailsQueryVariables = Exact<{
  href: Scalars['ID'];
}>;


export type DetailsQuery = { __typename?: 'Query', optionDetails: Maybe<{ __typename?: 'OptionDetails', name: Maybe<string>, href: Maybe<string>, type: Maybe<CallOrPutType>, strike: Maybe<number>, changePercent: Maybe<number>, change: Maybe<number>, updated: Maybe<string>, bid: Maybe<number>, ask: Maybe<number>, spread: Maybe<number>, last: Maybe<number>, high: Maybe<number>, low: Maybe<number>, volume: Maybe<number>, expires: Maybe<string>, optionType: Maybe<OptionType>, parity: Maybe<number>, delta: Maybe<number>, theta: Maybe<number>, vega: Maybe<number>, gamma: Maybe<number>, rho: Maybe<number>, IV: Maybe<number> }> };

export type InstrumentDetailsFragment = { __typename?: 'InstrumentDetails', name: string, href: string, change: Maybe<number>, changePercent: Maybe<number>, lastPrice: Maybe<number>, buyPrice: Maybe<number>, sellPrice: Maybe<number>, highestPrice: Maybe<number>, lowestPrice: Maybe<number>, updated: Maybe<string>, totalVolumeTraded: Maybe<number> };

export type OptionDetailsFragment = { __typename?: 'OptionDetails', name: Maybe<string>, href: Maybe<string>, type: Maybe<CallOrPutType>, strike: Maybe<number>, changePercent: Maybe<number>, change: Maybe<number>, updated: Maybe<string>, bid: Maybe<number>, ask: Maybe<number>, spread: Maybe<number>, last: Maybe<number>, high: Maybe<number>, low: Maybe<number>, volume: Maybe<number>, expires: Maybe<string>, optionType: Maybe<OptionType>, parity: Maybe<number>, delta: Maybe<number>, theta: Maybe<number>, vega: Maybe<number>, gamma: Maybe<number>, rho: Maybe<number>, IV: Maybe<number> };

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
  delta
  theta
  vega
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
export type InstrumentKeySpecifier = ('id' | 'name' | InstrumentKeySpecifier)[];
export type InstrumentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InstrumentDetailsKeySpecifier = ('buyPrice' | 'change' | 'changePercent' | 'highestPrice' | 'href' | 'lastPrice' | 'lowestPrice' | 'name' | 'sellPrice' | 'totalVolumeTraded' | 'updated' | InstrumentDetailsKeySpecifier)[];
export type InstrumentDetailsFieldPolicy = {
	buyPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	change?: FieldPolicy<any> | FieldReadFunction<any>,
	changePercent?: FieldPolicy<any> | FieldReadFunction<any>,
	highestPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	href?: FieldPolicy<any> | FieldReadFunction<any>,
	lastPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	lowestPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	sellPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	totalVolumeTraded?: FieldPolicy<any> | FieldReadFunction<any>,
	updated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OptionDetailsKeySpecifier = ('IV' | 'ask' | 'bid' | 'change' | 'changePercent' | 'delta' | 'expires' | 'gamma' | 'high' | 'href' | 'interest' | 'last' | 'low' | 'name' | 'optionType' | 'parity' | 'rho' | 'spread' | 'strike' | 'theta' | 'type' | 'updated' | 'vega' | 'volume' | OptionDetailsKeySpecifier)[];
export type OptionDetailsFieldPolicy = {
	IV?: FieldPolicy<any> | FieldReadFunction<any>,
	ask?: FieldPolicy<any> | FieldReadFunction<any>,
	bid?: FieldPolicy<any> | FieldReadFunction<any>,
	change?: FieldPolicy<any> | FieldReadFunction<any>,
	changePercent?: FieldPolicy<any> | FieldReadFunction<any>,
	delta?: FieldPolicy<any> | FieldReadFunction<any>,
	expires?: FieldPolicy<any> | FieldReadFunction<any>,
	gamma?: FieldPolicy<any> | FieldReadFunction<any>,
	high?: FieldPolicy<any> | FieldReadFunction<any>,
	href?: FieldPolicy<any> | FieldReadFunction<any>,
	interest?: FieldPolicy<any> | FieldReadFunction<any>,
	last?: FieldPolicy<any> | FieldReadFunction<any>,
	low?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	optionType?: FieldPolicy<any> | FieldReadFunction<any>,
	parity?: FieldPolicy<any> | FieldReadFunction<any>,
	rho?: FieldPolicy<any> | FieldReadFunction<any>,
	spread?: FieldPolicy<any> | FieldReadFunction<any>,
	strike?: FieldPolicy<any> | FieldReadFunction<any>,
	theta?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	updated?: FieldPolicy<any> | FieldReadFunction<any>,
	vega?: FieldPolicy<any> | FieldReadFunction<any>,
	volume?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OptionMatrixItemKeySpecifier = ('call' | 'put' | 'strike' | OptionMatrixItemKeySpecifier)[];
export type OptionMatrixItemFieldPolicy = {
	call?: FieldPolicy<any> | FieldReadFunction<any>,
	put?: FieldPolicy<any> | FieldReadFunction<any>,
	strike?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OptionsListKeySpecifier = ('options' | 'underlying' | OptionsListKeySpecifier)[];
export type OptionsListFieldPolicy = {
	options?: FieldPolicy<any> | FieldReadFunction<any>,
	underlying?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OptionsMatrixKeySpecifier = ('matrix' | 'underlying' | OptionsMatrixKeySpecifier)[];
export type OptionsMatrixFieldPolicy = {
	matrix?: FieldPolicy<any> | FieldReadFunction<any>,
	underlying?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OptionsWithExpiryKeySpecifier = ('expires' | 'options' | OptionsWithExpiryKeySpecifier)[];
export type OptionsWithExpiryFieldPolicy = {
	expires?: FieldPolicy<any> | FieldReadFunction<any>,
	options?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('instruments' | 'matrix' | 'optionDetails' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	instruments?: FieldPolicy<any> | FieldReadFunction<any>,
	matrix?: FieldPolicy<any> | FieldReadFunction<any>,
	optionDetails?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	Instrument?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InstrumentKeySpecifier | (() => undefined | InstrumentKeySpecifier),
		fields?: InstrumentFieldPolicy,
	},
	InstrumentDetails?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InstrumentDetailsKeySpecifier | (() => undefined | InstrumentDetailsKeySpecifier),
		fields?: InstrumentDetailsFieldPolicy,
	},
	OptionDetails?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OptionDetailsKeySpecifier | (() => undefined | OptionDetailsKeySpecifier),
		fields?: OptionDetailsFieldPolicy,
	},
	OptionMatrixItem?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OptionMatrixItemKeySpecifier | (() => undefined | OptionMatrixItemKeySpecifier),
		fields?: OptionMatrixItemFieldPolicy,
	},
	OptionsList?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OptionsListKeySpecifier | (() => undefined | OptionsListKeySpecifier),
		fields?: OptionsListFieldPolicy,
	},
	OptionsMatrix?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OptionsMatrixKeySpecifier | (() => undefined | OptionsMatrixKeySpecifier),
		fields?: OptionsMatrixFieldPolicy,
	},
	OptionsWithExpiry?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OptionsWithExpiryKeySpecifier | (() => undefined | OptionsWithExpiryKeySpecifier),
		fields?: OptionsWithExpiryFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;