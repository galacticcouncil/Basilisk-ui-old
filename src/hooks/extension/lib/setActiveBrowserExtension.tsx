import { ApolloCache } from "@apollo/client";
import { gql } from "graphql.macro";
import { Account, BrowserExtension, Extension, InputMaybe } from "../../../generated/graphql"
import { usePersistBrowserExtension } from "../resolvers/mutation/setActiveBrowserExtension";

export type PersistActiveBrowserExtension = ({ browserExtension }: {
    browserExtension: InputMaybe<BrowserExtension> | undefined
}) => void;

export const evictAllAccounts = (cache: ApolloCache<any>) => {
    const accountsData = cache.readQuery<{ 
        accounts?: Pick<Account, 'id'>[]
        activeAccount?: Pick<Account, 'id'>
    }>({
        query: gql`
            query GetAccountsForEviction {
                accounts @client {
                    id
                }
                activeAccount @client {
                    id
                }
            }
        `
    })

    const allAccountIds = accountsData?.accounts?.map(({ id }) => id);

    // console.log('evictAccounts', evictAccounts);

    allAccountIds?.forEach((id) => {
        cache.evict({
            id: `Account:${id}`
        })
    });

    // https://github.com/apollographql/apollo-client/issues/6795
    // Instead of all the manual cache eviction, we can use the same refetchQueries
    // mechanism as for LastBlock :thinkface:
    /**
     * Side effect of this eviction is that if the 'other' extension
     * also has the same active account available, we will de-facto
     * select an active account in the new extension automatically.
     * 
     * This most likely is not desirable
     */
    cache.evict({ id: 'ROOT_QUERY', fieldName: 'accounts' })
}

export const setActiveBrowserExtension = async (
    browserExtension: InputMaybe<BrowserExtension> | undefined, 
    persistActiveBrowserExtension: PersistActiveBrowserExtension,
    cache: ApolloCache<any>
): Promise<void> => {
    console.log('setActiveBrowserExtension', browserExtension);
    persistActiveBrowserExtension({ browserExtension });
    // wait for the local storage changes before finishing the mutation
    // TODO: find a better way to wait until the local storage changes are
    // propagated to the resolverRef
    await new Promise((resolve) => setTimeout(resolve, 0));

    evictAllAccounts(cache);

    // TODO: figure out why returning the modified object isnt enough?
    cache.writeFragment({
        id: 'Extension:0',
        fragment: gql`
            fragment ModifiedExtension on Extension {
                activeBrowserExtension
            }
        `,
        data: {
            activeBrowserExtension: browserExtension || null
        }
    })
}