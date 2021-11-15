import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { Query } from '../../generated/graphql';

const GET_FEE_PAYMENT_ASSETS = loader('./graphql/GetFeePaymentAssets.query.graphql')

interface GetFeePaymentAssetsQueryResponse {
    feePaymentAssets: Query['feePaymentAssets']
}

export const useGetFeePaymentAssetsQuery = () => useQuery<GetFeePaymentAssetsQueryResponse>(
    GET_FEE_PAYMENT_ASSETS, 
    { 
        notifyOnNetworkStatusChange: true,
    }
);