import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Account = Balances & IVesting & {
  __typename?: 'Account';
  balances: Array<Balance>;
  genesisHash?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  vesting: Vesting;
};


export type AccountBalancesArgs = {
  assetIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
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

export type Balances = {
  balances: Array<Balance>;
};


export type BalancesBalancesArgs = {
  assetIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export enum ChromeExtension {
  Polkadotjs = 'POLKADOTJS',
  Talisman = 'TALISMAN'
}

export type Config = {
  __typename?: 'Config';
  appName: Scalars['String'];
  feePaymentAsset?: Maybe<Scalars['String']>;
  nodeUrl: Scalars['String'];
  processorUrl: Scalars['String'];
};

export type Extension = {
  __typename?: 'Extension';
  extension?: Maybe<ChromeExtension>;
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

export type IVesting = {
  vesting?: Maybe<Vesting>;
};

export type LbpAssetWeights = {
  __typename?: 'LBPAssetWeights';
  current: Scalars['String'];
  final: Scalars['String'];
  initial: Scalars['String'];
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

export type LockedBalance = {
  __typename?: 'LockedBalance';
  assetId: Scalars['String'];
  balance: Scalars['String'];
  id?: Maybe<Scalars['String']>;
  lockId: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']>;
  setActiveAccount?: Maybe<Account>;
};

export type Pool = LbpPool | XykPool;

export type Query = Balances & IVesting & {
  __typename?: 'Query';
  _assetIds?: Maybe<AssetIds>;
  _empty?: Maybe<Scalars['String']>;
  _tradeType?: Maybe<TradeType>;
  _vestingSchedule?: Maybe<VestingSchedule>;
  accounts: Array<Account>;
  activeAccount?: Maybe<Account>;
  assets?: Maybe<Array<Asset>>;
  balances: Array<Balance>;
  config: Config;
  extension: Extension;
  feePaymentAssets?: Maybe<Array<FeePaymentAsset>>;
  lastBlock?: Maybe<LastBlock>;
  lockedBalances: Array<LockedBalance>;
  pools: Array<Pool>;
  vesting?: Maybe<Vesting>;
};


export type QueryBalancesArgs = {
  assetIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryLockedBalancesArgs = {
  address?: InputMaybe<Scalars['String']>;
  lockId: Scalars['String'];
};

export enum TradeType {
  Buy = 'Buy',
  Sell = 'Sell'
}

export type Vesting = {
  __typename?: 'Vesting';
  claimableAmount: Scalars['String'];
  lockedVestingBalance: Scalars['String'];
  originalLockBalance: Scalars['String'];
};

export type VestingSchedule = {
  __typename?: 'VestingSchedule';
  perPeriod: Scalars['String'];
  period: Scalars['String'];
  periodCount: Scalars['String'];
  start: Scalars['String'];
};

export type XykPool = {
  __typename?: 'XYKPool';
  assetInId: Scalars['String'];
  assetOutId: Scalars['String'];
  balances?: Maybe<Array<Balance>>;
  id: Scalars['String'];
};
