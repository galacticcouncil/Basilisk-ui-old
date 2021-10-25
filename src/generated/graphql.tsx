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

export type Config = {
  __typename?: 'Config';
  nodeUrl: Scalars['String'];
  processorUrl: Scalars['String'];
};

export type PolkadotJsExtension = {
  __typename?: 'PolkadotJsExtension';
  isAvailable: Scalars['Boolean'];
};

export type PolkadotJsExtensionAccount = {
  __typename?: 'PolkadotJsExtensionAccount';
  address: Scalars['String'];
  alias: Scalars['String'];
  id: Scalars['String'];
  isSelected: Scalars['Boolean'];
  network: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  config: Config;
};
