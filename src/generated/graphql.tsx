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

export type Balance = {
  __typename?: 'Balance';
  assetId: Scalars['String'];
  balance: Scalars['String'];
};

export type BuyActionDetail = {
  __typename?: 'BuyActionDetail';
  assetIn: Scalars['String'];
  assetInAmount: Scalars['String'];
  assetOut: Scalars['String'];
  assetOutAmount: Scalars['String'];
  buyPrice: Scalars['String'];
  feeAmount: Scalars['String'];
  feeAsset: Scalars['String'];
  poolId: Scalars['String'];
};

export type ClientUserAction = {
  __typename?: 'ClientUserAction';
  account: Scalars['String'];
  action: UserActionType;
  clientDetails?: Maybe<ClientUserActionDetail>;
  detail?: Maybe<UserActionDetail>;
  id: Scalars['String'];
  status: Status;
};

export type ClientUserActionDetail = {
  __typename?: 'ClientUserActionDetail';
  blockHeight?: Maybe<Scalars['String']>;
  inBlockHash?: Maybe<Scalars['String']>;
};

export type Config = {
  __typename?: 'Config';
  appName: Scalars['String'];
  feePaymentAsset?: Maybe<Scalars['String']>;
  nodeUrl: Scalars['String'];
  processorUrl: Scalars['String'];
};

export type Extension = {
  __typename?: 'Extension';
  isAvailable?: Maybe<Scalars['Boolean']>;
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
  _empty?: Maybe<Scalars['String']>;
  _tradeType?: Maybe<TradeType>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  action?: Maybe<ClientUserAction>;
  actionLog: Array<ClientUserAction>;
  assets?: Maybe<Array<Asset>>;
  config: Config;
  extension: Extension;
  feePaymentAssets?: Maybe<Array<FeePaymentAsset>>;
  lastBlock?: Maybe<LastBlock>;
  pools?: Maybe<Array<Pool>>;
  userActions: Array<UserAction>;
};

export type SellActionDetail = {
  __typename?: 'SellActionDetail';
  assetIn: Scalars['String'];
  assetInAmount: Scalars['String'];
  assetOut: Scalars['String'];
  assetOutAmount: Scalars['String'];
  feeAmount: Scalars['String'];
  feeAsset: Scalars['String'];
  poolId: Scalars['String'];
  sellPrice: Scalars['String'];
};

export enum Status {
  IsError = 'IsError',
  IsReady = 'IsReady',
  Unapproved = 'Unapproved',
  IsBroadcast = 'isBroadcast',
  IsFinalized = 'isFinalized',
  IsInBlock = 'isInBlock',
}

export enum TradeType {
  Buy = 'Buy',
  Sell = 'Sell',
}

export type UserAction = {
  __typename?: 'UserAction';
  account: Scalars['String'];
  action: UserActionType;
  detail?: Maybe<UserActionDetail>;
  id: Scalars['String'];
  parachainBlockHeight?: Maybe<Scalars['String']>;
  status: Status;
};

export type UserActionDetail = BuyActionDetail | SellActionDetail;

export enum UserActionType {
  AddLiquidity = 'AddLiquidity',
  Buy = 'Buy',
  RemoveLiquidity = 'RemoveLiquidity',
  Sell = 'Sell',
  SetFeeAsset = 'SetFeeAsset',
  Transfer = 'Transfer',
  Xcm = 'XCM',
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
