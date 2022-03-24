import { BrowserExtension, Extension } from "../../../generated/graphql";
import { web3Accounts, web3Enable, web3FromAddress } from "@polkadot/extension-dapp";
// import { 
//     web3Accounts as web3AccountsTalisman, 
//     web3Enable as web3EnableTalisman, 
//     web3FromAddress as web3FromAddressTalisman
// } from 'talisman-connect/libs/extension-dapp/src/index'
import { ApolloCache } from "@apollo/client";
import { gql } from "graphql.macro";

export interface Adapter {
    web3Accounts: () => ReturnType<typeof web3Accounts>,
    web3Enable: (name: string) => ReturnType<typeof web3Enable>
    web3FromAddress: (address: string) => ReturnType<typeof web3FromAddress>
}

const adapters: Record<BrowserExtension, Adapter | undefined> = {
    [BrowserExtension.Polkadotjs]: {
        web3Accounts,
        web3Enable,
        web3FromAddress
    },
    [BrowserExtension.Talisman]: {
        web3Accounts,
        web3Enable,
        web3FromAddress
    },
    // [BrowserExtension.Talisman]: (() => {
    //     return {
    //         web3Accounts: web3AccountsTalisman,
    //         // TODO: get rid of the hardcoded extension name
    //         web3Enable: (name: string) => web3EnableTalisman(name, 'talisman'),
    //         web3FromAddress: web3FromAddressTalisman
    //     }
    // })(),
    [BrowserExtension.Unset]: undefined,
}

export const extensionAdapter = (cache: ApolloCache<any>) => {
    const extensionData = cache.readFragment<Pick<Extension, 'activeBrowserExtension'>>({
        id: 'Extension:0',
        fragment: gql`
            fragment ActiveBrowserExtension on Extension {
                activeBrowserExtension
            }
        `
    });

    console.log('extensionAdapter', extensionData?.activeBrowserExtension);

    const extension = extensionData?.activeBrowserExtension
    return extension && adapters[extension];
}