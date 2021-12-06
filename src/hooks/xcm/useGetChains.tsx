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
                assets: ["2"], // Asset 2 is registered as KUSD in dev chainspec
                destWeight: 5e9
            },
            { name : "Kusama",
              id: "parent",
              assets: ["1"], // Asset 1 is registered as KSM in den chainspec
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

export const constructParachainDestination = (chain: ChainTransferData, destAccount: string)  =>{
    let interior;

    if ( chain.id === "parent") {
        // Transferring to relay chain
        interior = { X1: {
                AccountId32: {
                    id: destAccount,
                    network: "Any"
                }
            }}

    }else{
        // Transferring to parachain
        interior= {
            X2: [{
                Parachain: chain.id
            }, {
                AccountId32: {
                    id: destAccount,
                    network: "Any"
                }
            }]
        }
    }

    // XCM V1 support atm
    return { V1: {
            parents: 1,
            interior: interior
        }};
}