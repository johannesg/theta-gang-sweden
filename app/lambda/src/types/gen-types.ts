import { GraphQLResolveInfo } from 'graphql';
import { ContextWithDataSources } from './';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
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
  change?: Maybe<Scalars['Float']>;
  changePercent?: Maybe<Scalars['Float']>;
  buyPrice?: Maybe<Scalars['Float']>;
  sellPrice?: Maybe<Scalars['Float']>;
  lastPrice?: Maybe<Scalars['Float']>;
  highestPrice?: Maybe<Scalars['Float']>;
  lowestPrice?: Maybe<Scalars['Float']>;
  updated?: Maybe<Scalars['String']>;
  totalVolumeTraded?: Maybe<Scalars['Int']>;
};

export type OptionDetails = {
  __typename?: 'OptionDetails';
  name?: Maybe<Scalars['String']>;
  href?: Maybe<Scalars['String']>;
  type?: Maybe<CallOrPutType>;
  strike?: Maybe<Scalars['Float']>;
  changePercent?: Maybe<Scalars['Float']>;
  change?: Maybe<Scalars['Float']>;
  bid?: Maybe<Scalars['Float']>;
  ask?: Maybe<Scalars['Float']>;
  spread?: Maybe<Scalars['Float']>;
  last?: Maybe<Scalars['Float']>;
  high?: Maybe<Scalars['Float']>;
  low?: Maybe<Scalars['Float']>;
  volume?: Maybe<Scalars['Int']>;
  updated?: Maybe<Scalars['String']>;
  expires?: Maybe<Scalars['String']>;
  optionType?: Maybe<OptionType>;
  parity?: Maybe<Scalars['Int']>;
  delta?: Maybe<Scalars['Float']>;
  theta?: Maybe<Scalars['Float']>;
  vega?: Maybe<Scalars['Float']>;
  gamma?: Maybe<Scalars['Float']>;
  rho?: Maybe<Scalars['Float']>;
  IV?: Maybe<Scalars['Float']>;
  interest?: Maybe<Scalars['Float']>;
};

export type OptionMatrixItem = {
  __typename?: 'OptionMatrixItem';
  call?: Maybe<OptionDetails>;
  strike?: Maybe<Scalars['Float']>;
  put?: Maybe<OptionDetails>;
};

export enum OptionType {
  Weekly = 'WEEKLY',
  Standard = 'STANDARD'
}

export type OptionsList = {
  __typename?: 'OptionsList';
  underlying?: Maybe<InstrumentDetails>;
  options?: Maybe<Array<Maybe<OptionMatrixItem>>>;
};

export type OptionsMatrix = {
  __typename?: 'OptionsMatrix';
  underlying?: Maybe<InstrumentDetails>;
  matrix: Array<OptionsWithExpiry>;
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
  id: Scalars['ID'];
  type: OptionType;
  expires: Scalars['String'];
  includeDetails?: Maybe<Scalars['Boolean']>;
};


export type QueryOptionDetailsArgs = {
  id: Scalars['ID'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

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
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

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
  CallOrPutType: CallOrPutType;
  Instrument: ResolverTypeWrapper<Instrument>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  InstrumentDetails: ResolverTypeWrapper<InstrumentDetails>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  OptionDetails: ResolverTypeWrapper<OptionDetails>;
  OptionMatrixItem: ResolverTypeWrapper<OptionMatrixItem>;
  OptionType: OptionType;
  OptionsList: ResolverTypeWrapper<OptionsList>;
  OptionsMatrix: ResolverTypeWrapper<OptionsMatrix>;
  OptionsWithExpiry: ResolverTypeWrapper<OptionsWithExpiry>;
  Query: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Instrument: Instrument;
  ID: Scalars['ID'];
  String: Scalars['String'];
  InstrumentDetails: InstrumentDetails;
  Float: Scalars['Float'];
  Int: Scalars['Int'];
  OptionDetails: OptionDetails;
  OptionMatrixItem: OptionMatrixItem;
  OptionsList: OptionsList;
  OptionsMatrix: OptionsMatrix;
  OptionsWithExpiry: OptionsWithExpiry;
  Query: {};
  Boolean: Scalars['Boolean'];
}>;

export type InstrumentResolvers<ContextType = ContextWithDataSources, ParentType extends ResolversParentTypes['Instrument'] = ResolversParentTypes['Instrument']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InstrumentDetailsResolvers<ContextType = ContextWithDataSources, ParentType extends ResolversParentTypes['InstrumentDetails'] = ResolversParentTypes['InstrumentDetails']> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  href?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  change?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  changePercent?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  buyPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  sellPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  lastPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  highestPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  lowestPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  updated?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalVolumeTraded?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OptionDetailsResolvers<ContextType = ContextWithDataSources, ParentType extends ResolversParentTypes['OptionDetails'] = ResolversParentTypes['OptionDetails']> = ResolversObject<{
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  href?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['CallOrPutType']>, ParentType, ContextType>;
  strike?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  changePercent?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  change?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  bid?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  ask?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  spread?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  last?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  high?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  low?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  volume?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updated?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  expires?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  optionType?: Resolver<Maybe<ResolversTypes['OptionType']>, ParentType, ContextType>;
  parity?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  delta?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  theta?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  vega?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  gamma?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  rho?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  IV?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  interest?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OptionMatrixItemResolvers<ContextType = ContextWithDataSources, ParentType extends ResolversParentTypes['OptionMatrixItem'] = ResolversParentTypes['OptionMatrixItem']> = ResolversObject<{
  call?: Resolver<Maybe<ResolversTypes['OptionDetails']>, ParentType, ContextType>;
  strike?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  put?: Resolver<Maybe<ResolversTypes['OptionDetails']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OptionsListResolvers<ContextType = ContextWithDataSources, ParentType extends ResolversParentTypes['OptionsList'] = ResolversParentTypes['OptionsList']> = ResolversObject<{
  underlying?: Resolver<Maybe<ResolversTypes['InstrumentDetails']>, ParentType, ContextType>;
  options?: Resolver<Maybe<Array<Maybe<ResolversTypes['OptionMatrixItem']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OptionsMatrixResolvers<ContextType = ContextWithDataSources, ParentType extends ResolversParentTypes['OptionsMatrix'] = ResolversParentTypes['OptionsMatrix']> = ResolversObject<{
  underlying?: Resolver<Maybe<ResolversTypes['InstrumentDetails']>, ParentType, ContextType>;
  matrix?: Resolver<Array<ResolversTypes['OptionsWithExpiry']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OptionsWithExpiryResolvers<ContextType = ContextWithDataSources, ParentType extends ResolversParentTypes['OptionsWithExpiry'] = ResolversParentTypes['OptionsWithExpiry']> = ResolversObject<{
  expires?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['OptionMatrixItem']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = ContextWithDataSources, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  instruments?: Resolver<Maybe<Array<Maybe<ResolversTypes['Instrument']>>>, ParentType, ContextType>;
  matrix?: Resolver<Maybe<ResolversTypes['OptionsMatrix']>, ParentType, ContextType, RequireFields<QueryMatrixArgs, 'id' | 'type' | 'expires'>>;
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


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = ContextWithDataSources> = Resolvers<ContextType>;
