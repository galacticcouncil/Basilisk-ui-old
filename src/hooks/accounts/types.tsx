// make sure the __typename is well typed
import { Account } from '../../generated/graphql'

const __typename: Account['__typename'] = 'Account'

// helper function to decorate the extension entity for normalised caching
export const withTypename = (account: Partial<Account>) => ({
  __typename,
  ...account
})
