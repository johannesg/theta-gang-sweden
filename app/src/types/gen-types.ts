import { GraphQLResolveInfo } from 'graphql';
import { ContextWithDataSources } from './';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
  buyPrice?: Maybe<Scalars['Float']>;
  change?: Maybe<Scalars['Float']>;
  changePercent?: Maybe<Scalars['Float']>;
  highestPrice?: Maybe<Scalars['Float']>;
  href: Scalars['String'];
  lastPrice?: Maybe<Scalars['Float']>;
  lowestPrice?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  sellPrice?: Maybe<Scalars['Float']>;
  totalVolumeTraded?: Maybe<Scalars['Int']>;
  updated?: Maybe<Scalars['String']>;
};

export type OptionDetails = {
  __typename?: 'OptionDetails';
  IV?: Maybe<Scalars['Float']>;
  ask?: Maybe<Scalars['Float']>;
  bid?: Maybe<Scalars['Float']>;
  change?: Maybe<Scalars['Float']>;
  changePercent?: Maybe<Scalars['Float']>;
  delta?: Maybe<Scalars['Float']>;
  expires?: Maybe<Scalars['String']>;
  gamma?: Maybe<Scalars['Float']>;
  high?: Maybe<Scalars['Float']>;
  href?: Maybe<Scalars['String']>;
  interest?: Maybe<Scalars['Float']>;
  last?: Maybe<Scalars['Float']>;
  low?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  optionType?: Maybe<OptionType>;
  parity?: Maybe<Scalars['Int']>;
  rho?: Maybe<Scalars['Float']>;
  spread?: Maybe<Scalars['Float']>;
  strike?: Maybe<Scalars['Float']>;
  theta?: Maybe<Scalars['Float']>;
  type?: Maybe<CallOrPutType>;
  updated?: Maybe<Scalars['String']>;
  vega?: Maybe<Scalars['Float']>;
  volume?: Maybe<Scalars['Int']>;
};

export type OptionMatrixItem = {
  __typename?: 'OptionMatrixItem';
  call?: Maybe<OptionDetails>;
  put?: Maybe<OptionDetails>;
  strike?: Maybe<Scalars['Float']>;
};

export enum OptionType {
  Standard = 'STANDARD',
  Weekly = 'WEEKLY'
}

export type OptionsList = {
  __typename?: 'OptionsList';
  options?: Maybe<Array<Maybe<OptionMatrixItem>>>;
  underlying?: Maybe<InstrumentDetails>;
};

export type OptionsMatrix = {
  __typename?: 'OptionsMatrix';
  matrix: Array<OptionsWithExpiry>;
  underlying?: Maybe<InstrumentDetails>;
};

export type OptionsWithExpiry = {
  __typename?: 'OptionsWithExpiry';
  expires: Scalars['String'];
  options: Array<OptionMatrixItem>;
};

export type Query = {
  __typename?: 'Query';
  instruments?: Maybe<Array<Maybe<Instrument>>>;
  matrix?: Maybe<OptionsMatrix>;
  optionDetails?: Maybe<OptionDetails>;
};


export type QueryMatrixArgs = {
  expires: Scalars['String'];
  id: Scalars['ID'];
  includeDetails?: InputMaybe<Scalars['Boolean']>;
  type: OptionType;
};


export type QueryOptionDetailsArgs = {
  id: Scalars['ID'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CallOrPutType: CallOrPutType;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Instrument: ResolverTypeWrapper<Instrument>;
  InstrumentDetails: ResolverTypeWrapper<InstrumentDetails>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  OptionDetails: ResolverTypeWrapper<OptionDetails>;
  OptionMatrixItem: ResolverTypeWrapper<OptionMatrixItem>;
  OptionType: OptionType;
  OptionsList: ResolverTypeWrapper<OptionsList>;
  OptionsMatrix: ResolverTypeWrapper<OptionsMatrix>;
  OptionsWithExpiry: ResolverTypeWrapper<OptionsWithExpiry>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean'];
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  Instrument: Instrument;
  InstrumentDetails: InstrumentDetails;
  Int: Scalars['Int'];
  OptionDetails: OptionDetails;
  OptionMatrixItem: OptionMatrixItem;
  OptionsList: OptionsList;
  OptionsMatrix: OptionsMatrix;
  OptionsWithExpiry: OptionsWithExpiry;
  Query: {};
  String: Scalars['String'];
}>;

export type InstrumentResolvers<ContextType = ContextWithDataSources, ParentType extends ResolversParentTypes['Instrument'] = ResolversParentTypes['Instrument']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InstrumentDetailsResolvers<ContextType = ContextWithDataSources, ParentType extends ResolversParentTypes['InstrumentDetails'] = ResolversParentTypes['InstrumentDetails']> = ResolversObject<{
  buyPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  change?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  changePercent?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  highestPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  href?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  lowestPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sellPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  totalVolumeTraded?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updated?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OptionDetailsResolvers<ContextType = ContextWithDataSources, ParentType extends ResolversParentTypes['OptionDetails'] = ResolversParentTypes['OptionDetails']> = ResolversObject<{
  IV?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  ask?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  bid?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  change?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  changePercent?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  delta?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  expires?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  gamma?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  high?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  href?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  interest?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  last?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  low?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  optionType?: Resolver<Maybe<ResolversTypes['OptionType']>, ParentType, ContextType>;
  parity?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  rho?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  spread?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  strike?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  theta?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['CallOrPutType']>, ParentType, ContextType>;
  updated?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vega?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  volume?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OptionMatrixItemResolvers<ContextType = ContextWithDataSources, ParentType extends ResolversParentTypes['OptionMatrixItem'] = ResolversParentTypes['OptionMatrixItem']> = ResolversObject<{
  call?: Resolver<Maybe<ResolversTypes['OptionDetails']>, ParentType, ContextType>;
  put?: Resolver<Maybe<ResolversTypes['OptionDetails']>, ParentType, ContextType>;
  strike?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OptionsListResolvers<ContextType = ContextWithDataSources, ParentType extends ResolversParentTypes['OptionsList'] = ResolversParentTypes['OptionsList']> = ResolversObject<{
  options?: Resolver<Maybe<Array<Maybe<ResolversTypes['OptionMatrixItem']>>>, ParentType, ContextType>;
  underlying?: Resolver<Maybe<ResolversTypes['InstrumentDetails']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OptionsMatrixResolvers<ContextType = ContextWithDataSources, ParentType extends ResolversParentTypes['OptionsMatrix'] = ResolversParentTypes['OptionsMatrix']> = ResolversObject<{
  matrix?: Resolver<Array<ResolversTypes['OptionsWithExpiry']>, ParentType, ContextType>;
  underlying?: Resolver<Maybe<ResolversTypes['InstrumentDetails']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OptionsWithExpiryResolvers<ContextType = ContextWithDataSources, ParentType extends ResolversParentTypes['OptionsWithExpiry'] = ResolversParentTypes['OptionsWithExpiry']> = ResolversObject<{
  expires?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['OptionMatrixItem']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = ContextWithDataSources, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  instruments?: Resolver<Maybe<Array<Maybe<ResolversTypes['Instrument']>>>, ParentType, ContextType>;
  matrix?: Resolver<Maybe<ResolversTypes['OptionsMatrix']>, ParentType, ContextType, RequireFields<QueryMatrixArgs, 'expires' | 'id' | 'type'>>;
  optionDetails?: Resolver<Maybe<ResolversTypes['OptionDetails']>, ParentType, ContextType, RequireFields<QueryOptionDetailsArgs, 'id'>>;
}>;

export type Resolvers<ContextType = ContextWithDataSources> = ResolversObject<{
  Instrument?: InstrumentResolvers<ContextType>;
  InstrumentDetails?: InstrumentDetailsResolvers<ContextType>;
  OptionDetails?: OptionDetailsResolvers<ContextType>;
  OptionMatrixItem?: OptionMatrixItemResolvers<ContextType>;
  OptionsList?: OptionsListResolvers<ContextType>;
  OptionsMatrix?: OptionsMatrixResolvers<ContextType>;
  OptionsWithExpiry?: OptionsWithExpiryResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;

