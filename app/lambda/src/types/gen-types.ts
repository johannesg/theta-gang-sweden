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
  expires: Scalars['String'];
  optionType: OptionType;
  type: CallOrPutType;
  buyIV?: Maybe<Scalars['String']>;
  delta?: Maybe<Scalars['Float']>;
  theta?: Maybe<Scalars['Float']>;
  vega?: Maybe<Scalars['Float']>;
  sellIV?: Maybe<Scalars['String']>;
  gamma?: Maybe<Scalars['Float']>;
  rho?: Maybe<Scalars['Float']>;
  IV?: Maybe<Scalars['String']>;
};

export type OptionInfo = {
  __typename?: 'OptionInfo';
  name: Scalars['String'];
  href: Scalars['String'];
  type: CallOrPutType;
  strike: Scalars['Float'];
  buyVolume?: Maybe<Scalars['Int']>;
  buy?: Maybe<Scalars['Float']>;
  sell?: Maybe<Scalars['Float']>;
  sellVolume?: Maybe<Scalars['Int']>;
};

export type OptionMatrixItem = {
  __typename?: 'OptionMatrixItem';
  call?: Maybe<OptionInfo>;
  strike?: Maybe<Scalars['Float']>;
  put?: Maybe<OptionInfo>;
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

export type Query = {
  __typename?: 'Query';
  instruments?: Maybe<Array<Maybe<Instrument>>>;
  options?: Maybe<OptionsList>;
  optionDetails?: Maybe<OptionDetails>;
};


export type QueryOptionsArgs = {
  id: Scalars['ID'];
  type: OptionType;
  expires: Scalars['String'];
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
  OptionInfo: ResolverTypeWrapper<OptionInfo>;
  OptionMatrixItem: ResolverTypeWrapper<OptionMatrixItem>;
  OptionType: OptionType;
  OptionsList: ResolverTypeWrapper<OptionsList>;
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
  OptionInfo: OptionInfo;
  OptionMatrixItem: OptionMatrixItem;
  OptionsList: OptionsList;
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
  expires?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  optionType?: Resolver<ResolversTypes['OptionType'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['CallOrPutType'], ParentType, ContextType>;
  buyIV?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  delta?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  theta?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  vega?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  sellIV?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  gamma?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  rho?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  IV?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OptionInfoResolvers<ContextType = ContextWithDataSources, ParentType extends ResolversParentTypes['OptionInfo'] = ResolversParentTypes['OptionInfo']> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  href?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['CallOrPutType'], ParentType, ContextType>;
  strike?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  buyVolume?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  buy?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  sell?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  sellVolume?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OptionMatrixItemResolvers<ContextType = ContextWithDataSources, ParentType extends ResolversParentTypes['OptionMatrixItem'] = ResolversParentTypes['OptionMatrixItem']> = ResolversObject<{
  call?: Resolver<Maybe<ResolversTypes['OptionInfo']>, ParentType, ContextType>;
  strike?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  put?: Resolver<Maybe<ResolversTypes['OptionInfo']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OptionsListResolvers<ContextType = ContextWithDataSources, ParentType extends ResolversParentTypes['OptionsList'] = ResolversParentTypes['OptionsList']> = ResolversObject<{
  underlying?: Resolver<Maybe<ResolversTypes['InstrumentDetails']>, ParentType, ContextType>;
  options?: Resolver<Maybe<Array<Maybe<ResolversTypes['OptionMatrixItem']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = ContextWithDataSources, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  instruments?: Resolver<Maybe<Array<Maybe<ResolversTypes['Instrument']>>>, ParentType, ContextType>;
  options?: Resolver<Maybe<ResolversTypes['OptionsList']>, ParentType, ContextType, RequireFields<QueryOptionsArgs, 'id' | 'type' | 'expires'>>;
  optionDetails?: Resolver<Maybe<ResolversTypes['OptionDetails']>, ParentType, ContextType, RequireFields<QueryOptionDetailsArgs, 'id'>>;
}>;

export type Resolvers<ContextType = ContextWithDataSources> = ResolversObject<{
  Instrument?: InstrumentResolvers<ContextType>;
  InstrumentDetails?: InstrumentDetailsResolvers<ContextType>;
  OptionDetails?: OptionDetailsResolvers<ContextType>;
  OptionInfo?: OptionInfoResolvers<ContextType>;
  OptionMatrixItem?: OptionMatrixItemResolvers<ContextType>;
  OptionsList?: OptionsListResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = ContextWithDataSources> = Resolvers<ContextType>;
