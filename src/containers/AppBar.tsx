import { first } from 'lodash';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGetActiveAccountQuery } from '../hooks/accounts/queries/useGetActiveAccountQuery';
import { nativeAssetId } from '../hooks/balances/useGetBalancesByAddress';
import { useLastBlockQuery } from '../hooks/lastBlock/useLastBlockQuery';
export const AppBar = () => {
    // TODO: there is no loading state for last block
    // since its populated in the cache manually
    const { data: lastBlockData } = useLastBlockQuery();
    const { data: activeAccountData } = useGetActiveAccountQuery();

    // TODO: should probably be showing the fee payment asset here
    const nativeAssetBalance = useMemo(() => (
        first(
            activeAccountData?.account?.balances
                .filter(balance => balance.assetId === nativeAssetId)
        )?.balance
    ), [activeAccountData])

    return (
        <div style={{
            textAlign: 'center',
            marginBottom: '24px'
        }}>
            <div>
                <Link to='/'>
                    Trade
                </Link>
                {' | '}
                <Link to='/wallet'>
                    Wallet
                </Link>
                {' | '}
                <Link to='/config'>
                    Config
                </Link>

                <div>
                    <span>
                        <b>Last block: </b>
                        {lastBlockData?.lastBlock?.number
                            ? `#${lastBlockData?.lastBlock?.number}`
                            : 'loading...'
                        }
                    </span>
                    {' | '}
                    <span>
                        <b>Active account: </b>
                        {activeAccountData?.account?.name
                            ? (
                                <>
                                    <span>
                                        {activeAccountData?.account?.name}
                                        {' | '}
                                        {nativeAssetBalance} BSX
                                    </span>
                                </>
                            )
                            : 'loading...'
                        }
                    </span>
                </div>
            </div>
        </div>
    )
}