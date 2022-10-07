/* eslint-disable import/no-anonymous-default-export */
import { Fee } from './generated/graphql'

export default {
  appName: 'basilisk-ui',
  xykFee: {
    numerator: '3',
    denominator: '1000'
  } as Fee,
  nativeAssetId: '0',
  basiliskAddressPrefix: 10041, // prefix for the ss58 address formatting of substrate addresses
  basiliskWeb3ProviderName: 'basilisk-ui',
  defaultValue: '0'
}
