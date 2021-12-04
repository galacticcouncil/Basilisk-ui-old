import { first } from 'lodash';
import { useMemo } from 'react';
import { ActionBar } from '../components/Navigation/ActionBar';
import { Navigation } from '../components/Navigation/Navigation';
import { useGetActiveAccountQuery } from '../hooks/accounts/queries/useGetActiveAccountQuery';
import { nativeAssetId } from '../hooks/balances/useGetBalancesByAddress';
import { useLastBlockQuery } from '../hooks/lastBlock/useLastBlockQuery';
import { useGetExtensionQuery } from '../hooks/polkadotJs/useGetExtensionQuery';

import './TopBar.scss';

export const TopBar = () => {
    // TODO: there is no loading state for last block
    // since its populated in the cache manually
    const { data: lastBlockData } = useLastBlockQuery();
    const { data: activeAccountData, loading: activeAccountLoading, error } = useGetActiveAccountQuery();
    const { data: extensionData, loading: extensionLoading } = useGetExtensionQuery();

    error && console.error(error);
    
    // TODO: should probably be showing the fee payment asset here
    const nativeAssetBalance = useMemo(() => (
        first(
            activeAccountData?.account?.balances
                ?.filter(balance => balance.assetId === nativeAssetId)
        )?.balance
    ), [activeAccountData])

    return (
        <div className='top-bar'>
            <Navigation />
            
            <div>
                <b>Last block: </b>
                {lastBlockData?.lastBlock?.parachainBlockNumber
                    ? `#${lastBlockData?.lastBlock?.parachainBlockNumber} / #${lastBlockData?.lastBlock?.relaychainBlockNumber}`
                    : 'loading...'
                }
            </div>
                
            <ActionBar {...{
                isExtensionAvailable: !!extensionData && !!extensionData.extension?.isAvailable,
                extensionLoading,
                activeAccountLoading,
                accountData: activeAccountData ? { 
                    name: activeAccountData.account ? activeAccountData.account.name ? activeAccountData.account.name : undefined  : undefined,
                    nativeAssetBalance,
                    address: 'placeholder fill me'
                } : undefined
            }}/>                
        </div>
    )
}