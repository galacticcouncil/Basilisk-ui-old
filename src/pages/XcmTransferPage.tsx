import { useCallback } from 'react';
import { useGetAssetsQuery } from '../hooks/assets/queries/useGetAssetsQuery';
import { useForm } from 'react-hook-form';
import {useXcmTransferMutation, XcmTransferMutationVariables} from '../hooks/xcm/useXcmTransferMutation';
import {useGetChains} from "../hooks/xcm/useGetChains";

export const useAssets = (watch: any) => {
    const { data: assets, loading } = useGetAssetsQuery();
    const [assetId] = watch(['assetId']);

    return {
        assets,
        loading,
        assetId
    }
}

const useChains = () => {
    const chains = useGetChains();

    return { chains };
}

export const useXcmTransferForm= (
) => {
    const [xcmTransfer] = useXcmTransferMutation();

    const form = useForm<any, any>({
        defaultValues: {
            fromChain: '',
            toChain: '',
            asset: '0',
            to: '',
            amount: '0'
        }
    });

    const handleSubmit = (data: any) => {
        const vars: XcmTransferMutationVariables = {
            fromChain: data.fromChain,
            toChain: data.toChain,
            currencyId: data.asset,
            amount: data.amount,
            to: data.to
        }
        xcmTransfer(
            { variables: vars}
        )
    }

    return {
        form,
        handleSubmit: handleSubmit
    }
}

export const XcmTransferForm= () => {
    const { form, handleSubmit } = useXcmTransferForm();
    const { register, watch } = form;
    const { assets, loading: assetsLoading } = useAssets(watch);

    const { chains } = useChains();

    const chainsOptions = useCallback( () => {
        return <>
            {
                chains?.map( chain => (
                    <option key={chain.id} value={`${chain.name}`}>{chain.name}</option>
                ))
            }
        </>
    }, [chains]) ;

    const assetOptions = useCallback(() => {
        return <>
            {assets
                ?.assets
                .map(asset => (
                    <option key={asset.id} value={`${asset.id}`}>{asset.id}</option>
                ))
            }
        </>
    }, [assets]);

    return <div>
        {assetsLoading
            ? <i>[TradeForm] Loading assets...</i>
            : <i>[TradeForm] Everything is up to date</i>
        }

        <br /><br />

        <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div>
                <div>
                    <label><b>From chain: </b></label>
                    <select
                        {...register('fromChain', {
                            required: true
                        })}
                    >
                        {chainsOptions()}
                    </select>
                </div>
            </div>
            <br />
            <div>
                <label><b>To chain: </b></label>
                <select
                    {...register('toChain', {
                        required: true
                    })}
                >
                    {chainsOptions()}
                </select>
            </div>
            <br />
            <div>
                <label><b>Asset: </b></label>
                <select
                    {...register('asset', {
                        required: true
                    })}
                >
                    {assetOptions()}
                </select>
            </div>
            <br />
            <div>
                <label><b>Destination: </b></label>
                <input
                    type="text"
                    width={100}
                    style={{
                        width: '100%',
                        marginTop: '12px',
                        marginBottom: '24px'
                    }}
                    {...register('to', {
                        required: true
                    })}
                />
            </div>
            <div>
                <label><b>Amount: </b></label>
                <input
                    type="text"
                    width={100}
                    style={{
                        width: '100%',
                        marginTop: '12px',
                        marginBottom: '24px'
                    }}
                    {...register('amount', {
                        required: true
                    })}
                />
            </div>
            <button
                type='submit'
                style={{
                    width: '100%',
                }}
            >Transfer</button>

            <br /><br />

        </form>
    </div>
}

export const XcmTransferPage = () => {
    return <div>
        <h1>Cross chain transfer</h1>

        <XcmTransferForm
        />
    </div>
}