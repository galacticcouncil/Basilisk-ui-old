export type ChainTransferData = {
    name: string,
    id: string,
    assets?: string[],
    destWeight?: number
}

export type ChainType = {
    name: string,
    id: string,
    supportedTransfers: ChainTransferData[]
};


export const CHAINS : ChainType[] = [
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

/**
 *
 * Checks if XCM transfer is suported for given from/to chain and currency combination
 *
 * Returns xcm transfer details for supported xcm transfer if found, otherwise undefined.
 */
export const isXcmTransferSupported = (fromChain: string, toChain: string, currencyId: string) => {
    const from = CHAINS.find( v => v.name === fromChain );
    const to = CHAINS.find( v => v.name === toChain);

    let destChain;

    if (from && to)
    {
        let c = from.supportedTransfers.find(v => v.name === toChain) as ChainTransferData;
        if ( c && !!c.assets?.find(v => v === currencyId) ){
            destChain = c
        }
    }

    return {
        destChain
    }
}
