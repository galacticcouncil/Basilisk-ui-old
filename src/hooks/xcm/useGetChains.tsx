import {useMemo} from 'react';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs'

export type ChainType = {
    name: string,
    id: string,
    supportedTransfers: any[]
};

export type ChainTransferData = {
    name: string,
    id: string,
    assets?: string[],
    destWeight?: number
}

export const Chains = [
    {
        name: "Kusama",
        id: "parent",
        supportedTransfers: []
    },
    {
        name: "Basilisk",
        id: "2084",
        supportedTransfers: [
            { name : "Karura",
                id: "2000",
                assets: ["2"],
                destWeight: 5e9
            }
        ]
    },
    {
        name: "Karura",
        id: "2000",
        supportedTransfers: []
    }
]



export const useGetChains = () => {
    const { apiInstance, loading } = usePolkadotJsContext();

    return useMemo(() => {
        if (!apiInstance || loading) return;

        return Chains.map( (v) => v as ChainType);
    }, [
        apiInstance,
        loading
    ]);
}