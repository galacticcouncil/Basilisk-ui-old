import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
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

export type Account = {
  __typename?: 'Account';
  balances: Array<Balance>;
  id: Scalars['String'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  vestingSchedule?: Maybe<Array<VestingSchedule>>;
};

export type Balance = {
  __typename?: 'Balance';
  assetId: Scalars['String'];
  balance: Scalars['String'];
};

export type Config = {
  __typename?: 'Config';
  appName: Scalars['String'];
  nodeUrl: Scalars['String'];
  processorUrl: Scalars['String'];
};

export type LastBlock = {
  __typename?: 'LastBlock';
  id: Scalars['String'];
  number?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  config?: Maybe<Config>;
  lastBlock?: Maybe<LastBlock>;
};

export type VestingSchedule = {
  __typename?: 'VestingSchedule';
  perPeriod?: Maybe<Scalars['String']>;
  period?: Maybe<Scalars['String']>;
  periodCount?: Maybe<Scalars['String']>;
  remainingVestingBalance?: Maybe<Scalars['String']>;
  start?: Maybe<Scalars['String']>;
};
