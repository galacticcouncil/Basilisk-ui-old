import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Account = {
  __typename?: 'Account';
  balances: Array<Balance>;
  id: Scalars['String'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  vestingSchedule: VestingSchedule;
};

export type Asset = {
  __typename?: 'Asset';
  id: Scalars['String'];
};

export type AssetIds = {
  __typename?: 'AssetIds';
  a: Scalars['String'];
  b?: Maybe<Scalars['String']>;
};

export type Balance = {
  __typename?: 'Balance';
  assetId: Scalars['String'];
  balance: Scalars['String'];
  id?: Maybe<Scalars['String']>;
};

export type Config = {
  __typename?: 'Config';
  appName: Scalars['String'];
  feePaymentAsset?: Maybe<Scalars['String']>;
  nodeUrl: Scalars['String'];
  processorUrl: Scalars['String'];
};

export type Constants = {
  __typename?: 'Constants';
  lbp?: Maybe<LbpConstants>;
};

export type Extension = {
  __typename?: 'Extension';
  id: Scalars['String'];
  isAvailable: Scalars['Boolean'];
};

export type Fee = {
  __typename?: 'Fee';
  denominator: Scalars['String'];
  numerator: Scalars['String'];
};

export type FeePaymentAsset = {
  __typename?: 'FeePaymentAsset';
  assetId?: Maybe<Scalars['String']>;
  fallbackPrice?: Maybe<Scalars['String']>;
};

export type LbpAssetWeights = {
  __typename?: 'LBPAssetWeights';
  current: Scalars['String'];
  final: Scalars['String'];
  initial: Scalars['String'];
};

export type LbpConstants = {
  __typename?: 'LBPConstants';
  repayFee?: Maybe<Fee>;
};

export type LbpPool = {
  __typename?: 'LBPPool';
  assetAWeights: LbpAssetWeights;
  assetBWeights: LbpAssetWeights;
  assetInId: Scalars['String'];
  assetOutId: Scalars['String'];
  balances?: Maybe<Array<Balance>>;
  endBlock: Scalars['String'];
  fee: Fee;
  id: Scalars['String'];
  repayTargetReached: Scalars['Boolean'];
  startBlock: Scalars['String'];
};

export type LastBlock = {
  __typename?: 'LastBlock';
  id: Scalars['String'];
  parachainBlockNumber?: Maybe<Scalars['String']>;
  relaychainBlockNumber?: Maybe<Scalars['String']>;
};

export type Pool = LbpPool | XykPool;

export type Query = {
  __typename?: 'Query';
  _assetIds?: Maybe<AssetIds>;
  _empty?: Maybe<Scalars['String']>;
  _tradeType?: Maybe<TradeType>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  assets?: Maybe<Array<Asset>>;
  balances: Array<Balance>;
  config: Config;
  constants: Constants;
  extension: Extension;
  feePaymentAssets?: Maybe<Array<FeePaymentAsset>>;
  lastBlock?: Maybe<LastBlock>;
  pools?: Maybe<Array<Pool>>;
};

export enum TradeType {
  Buy = 'Buy',
  Sell = 'Sell',
}

export type VestingSchedule = {
  __typename?: 'VestingSchedule';
  perPeriod?: Maybe<Scalars['String']>;
  period?: Maybe<Scalars['String']>;
  periodCount?: Maybe<Scalars['String']>;
  remainingVestingAmount?: Maybe<Scalars['String']>;
  start?: Maybe<Scalars['String']>;
};

export type XykPool = {
  __typename?: 'XYKPool';
  assetInId: Scalars['String'];
  assetOutId: Scalars['String'];
  balances?: Maybe<Array<Balance>>;
  id: Scalars['String'];
};
