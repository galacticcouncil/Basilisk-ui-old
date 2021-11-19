import './App.scss';
import { MultiProvider } from './containers/MultiProvider';
import { Account, LastBlock, Maybe, Pool } from './generated/graphql';
import { useGetAccountsQuery } from './hooks/accounts/queries/useGetAccountsQuery';
import { useGetActiveAccountQuery } from './hooks/accounts/queries/useGetActiveAccountQuery';
import { useSetActiveAccountMutation } from './hooks/accounts/mutations/useSetActiveAccountMutation';
import { usePolkadotJsContext } from './hooks/polkadotJs/usePolkadotJs';
import { useLastBlockQuery } from './hooks/lastBlock/useLastBlockQuery';
import { useClaimVestedAmountMutation } from './hooks/vesting/useClaimVestedAmountMutation';
import log from 'loglevel';
import { useTransferBalanceMutation } from './hooks/balances/useTransferBalanceMutation';
import { useEstimateTransferBalance } from './hooks/balances/useBalanceMutationResolvers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useContextualGetExtensionLazyQuery } from './hooks/polkadotJs/useGetExtensionQuery';
import { useGetConfigQuery } from './hooks/config/useGetConfigQuery';
import { usePrevious } from 'react-use';
import { first, isEqual, nth } from 'lodash';
import { useSetConfigMutation } from './hooks/config/useSetConfigMutation';
import { useGetFeePaymentAssetsQuery } from './hooks/feePaymentAssets/useGetFeePaymentAssetsQuery';
import { useGetPoolsQuery } from './hooks/pools/queries/useGetPoolsQuery';
import { useGetPoolByAssetsQuery } from './hooks/pools/queries/useGetPoolByAssetsQuery';
import { useGetAssetsQuery } from './hooks/assets/queries/useGetAssetsQuery';
import { useForm } from 'react-hook-form';

log.setLevel('info');

export const AccountDisplay = ({ account, lastBlock }: { account?: Maybe<Account> | undefined, lastBlock: Maybe<LastBlock> | undefined }) => {
  const [setActiveAccount] = useSetActiveAccountMutation({ id: account?.id })
  const [claimVestedAmount, { loading: claimLoading, error: claimError }] = useClaimVestedAmountMutation();
  const transferBalanceVariables = {
    from: account?.id,
    to: 'bXi1Xh8UZvKUFCezgut35kv7U7ss3mK2BnEj3rdEen1tkaSoy',
    currencyId: '0',
    amount: '123456'
  };
  const [transferBalance, { loading: transferLoading, error: errorLoading }] = useTransferBalanceMutation(transferBalanceVariables);
  const { paymentInfo, estimatePaymentInfo } = useEstimateTransferBalance(transferBalanceVariables);

  useEffect(() => {
    estimatePaymentInfo();
  }, [lastBlock?.number])

  return <div>
    <span>{account?.__typename}</span>
    <p>Last block: {lastBlock?.number}</p>
    <p>{account?.id}</p>
    <p>{account?.name}</p>
    <p>Claim loading: {claimLoading ? 'true' : 'false'}</p>
    <button onClick={_ => claimVestedAmount()}>claim</button>
    <button onClick={_ => transferBalance()}>transfer</button>
    <p>Transfer estimate: {paymentInfo?.partialFee.toHuman()}</p>
    <p>Active: {account?.isActive ? 'true' : 'false'}</p>


    {account?.vestingSchedule
      ?
      <>
        <p>Vesting schedule start: {account.vestingSchedule.start}</p>
      </>
      : <></>
    }

    <div>
      <p>Balances:</p>
      {account?.balances.map((balance, i) => (
        <p key={i}>{balance.assetId}: {balance.balance}</p>
      ))}
    </div>
    <button onClick={_ => setActiveAccount()}>Set active</button>
    <p>-------</p>
  </div>
}

export const ActiveAccount = () => {
  const { data, loading, refetch, networkStatus, error } = useGetActiveAccountQuery();

  return <div className="active-account">
    <h4 className="active-account__heading">Active</h4>
    <p>Loading: {loading ? 'true' : 'false'}</p>
    <p>Network status: {networkStatus}</p>
    <button onClick={_ => refetch && refetch()}>refetch</button>
    <AccountDisplay account={data?.account} lastBlock={data?.lastBlock} />
  </div>
}

export const Accounts = () => {
  const { data, loading, refetch, networkStatus, error } = useGetAccountsQuery();
  error && console.error(error);
  return <>
    <h4>Accounts</h4>
    <p>Loading: {loading ? 'true' : 'false'}</p>
    <p>Network status: {networkStatus}</p>
    <button onClick={_ => refetch && refetch()}>refetch</button>
    {/* <p>Error: {error}</p> */}
    {data?.accounts?.map((account, i) => (
      <div key={i}>
        <AccountDisplay account={account} lastBlock={data.lastBlock} />
      </div>
    ))}
  </>
}

export const LastBlockDisplay = () => {
  const { data, loading } = useLastBlockQuery();

  return <div>
    <h4>Last block</h4>
    <p>Block: {data?.lastBlock?.number}</p>
    <p>Loading: {loading ? 'true' : 'false'}</p>
  </div>
}

export const ExtensionConnector = () => {
  const [getExtension, { data }] = useContextualGetExtensionLazyQuery();
  return <button onClick={_ => getExtension()}>Connect extension</button>
}

export const ConfigDisplay = () => {
  const { data, error, refetch } = useGetConfigQuery();
  const [setConfigMutation] = useSetConfigMutation();
  const feePaymentAsset = data?.config?.feePaymentAsset === '0' ? '1' : '0'

  const setConfig = useCallback(() => data?.config ? setConfigMutation({
    variables: {
      config: {
        ...data.config,
        feePaymentAsset
      }
    }
  }) : null, [data]);

  if (error) console.error(error);

  return <div>
    <p>App name: {data?.config?.appName}</p>
    <p>Fee payment asset: {data?.config?.feePaymentAsset}</p>
    <button onClick={_ => setConfig()}>set config</button>
  </div>
}

export const FeePaymentAssets = () => {
  const { data, loading, error } = useGetFeePaymentAssetsQuery();

  return <>
    {data?.feePaymentAssets?.map((feePaymentAsset) => {
      return <div key={feePaymentAsset.assetId}>
        {feePaymentAsset.assetId} / {feePaymentAsset.fallbackPrice}
      </div>
    })}
  </>
}

export const PoolList = () => {
  const { data, loading, error } = useGetPoolByAssetsQuery({
    assetAId: '0',
    assetBId: '1',
  });
  error && console.error(error);
  console.log('pool', data);
  return <></>
}

export const AssetList = () => {
  const { data, error } = useGetAssetsQuery();
  error && console.error(error);
  console.log('assets', data);
  return <></>
}

export const TradeForm = ({
  onAssetIdsChange,
  pool
}: {
  onAssetIdsChange: (assetAId: string, assetBId: string) => void,
  pool?: Pool
}) => {
  const { register, handleSubmit, watch, formState: { errors }, getValues, setValue, trigger, reset } = useForm<any, any>({
    defaultValues: {
      assetAId: '0',
      assetBId: '1',
      assetAAmount: '0',
      assetBAmount: '0'
    }
  });

  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  // should actually use the network status instead
  const { data: assetsData, loading: assetsLoading } = useGetAssetsQuery();

  const [assetAId, assetAAmount] = watch(['assetAId', 'assetAAmount']);
  const [assetBId, assetBAmount] = watch(['assetBId', 'assetBAmount']);

  useEffect(() => { setTradeType('buy') }, [assetAId, assetAAmount]);
  useEffect(() => { setTradeType('sell') }, [assetBId, assetBAmount]);

  console.log('pool', pool);

  useEffect(() => {
    onAssetIdsChange(assetAId, assetBId);
  }, [assetAId, assetBId]);

  const onSubmit = (data: any) => console.log('submitted yay', data);

  const assetOptions = useCallback((withoutAssetId: string | undefined) => {
    return <>
      {assetsData
        ?.assets
        .filter(asset => asset.id !== withoutAssetId)
        .map(asset => (
          <option key={asset.id} value={`${asset.id}`}>{asset.id}</option>
        ))
      }
    </>
  }, [assetsData]);

  console.log('form errors', errors);

  return <div>
    {assetsLoading
      ? <h1>Loading assets...</h1>
      : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div>
              <label>Asset A:</label>
              <select
                {...register('assetAId', {
                  required: true
                })}
              >
                {assetOptions(getValues('assetBId'))}
              </select>
            </div>
            <div>
              <div>
                <input
                  type="text"
                  width={100}
                  {...register('assetAAmount', {
                    required: true
                  })}
                />
              </div>
            </div>
          </div>
          <div>
            <label>Asset B:</label>
            <select
              {...register('assetBId', {
                required: true
              })}
            >
              {assetOptions(getValues('assetAId'))}
            </select>
          </div>
          <div>
            <input
              type="text"
              width={100}
              {...register('assetBAmount', {
                required: true
              })}
            />
          </div>
          <button type='submit'>Trade</button>

          <br/><br/>

          <div>
              <p>Trade type: {tradeType}</p>

              {!pool
                ? <p>Pool does not exist</p>
                : <div>
                  <p>Pool type: {pool?.__typename}</p>
                  <p>Liquidity {nth(pool?.balances, 0)?.assetId}: {nth(pool?.balances, 0)?.balance}</p>
                  <p>Liquidity {nth(pool?.balances, 1)?.assetId}: {nth(pool?.balances, 1)?.balance}</p>
                  <p>Spot price: TODO</p>
                </div>
              }

            </div>
        </form>
      )
    }
  </div>
}

export const TradePage = () => {
  const { loading } = usePolkadotJsContext();
  const [assetIds, setAssetIds] = useState<{
    assetAId: undefined | string,
    assetBId: undefined | string
  }>({
    assetAId: undefined,
    assetBId: undefined
  })

  const { data: poolData, networkStatus } = useGetPoolByAssetsQuery(assetIds);


  const handleAssetIdsChange = (assetAId: string, assetBId: string) => {
    console.log('assets changed');
    setAssetIds({
      assetAId, assetBId
    })
  }

  return <div>
    {loading
      ? <h1>Connecting to the node...</h1>
      : <TradeForm onAssetIdsChange={handleAssetIdsChange} pool={poolData?.pool} />
    }
  </div>
}

export const Page = () => {
  const { loading } = usePolkadotJsContext();

  return <>
    {loading
      ? (
        <p>Loading...</p>
      )
      : (<>
        {/* <FeePaymentAssets /> */}
        {/* <ExtensionConnector /> */}
        {/* <ConfigDisplay /> */}
        {/* <LastBlockDisplay /> */}
        {/* <ActiveAccount /> */}
        {/* <Accounts /> */}
        {/* <PoolList /> */}
        <AssetList />
      </>)
    }
  </>
}

export const App = () => {
  return (
    <MultiProvider>
      {/* <Router></Router> */}
    </MultiProvider>
  );
}

export default App;
