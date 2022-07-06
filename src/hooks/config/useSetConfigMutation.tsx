import { useMutation } from '@apollo/client';
import { loader } from 'graphql.macro';
import { Config } from '../../generated/graphql';
import { GET_CONFIG } from './useGetConfigQuery';

export const SET_CONFIG = loader('./graphql/SetConfig.mutation.graphql');

export interface SetConfigMutationVariables {
    config: Partial<Config> | undefined
}

export const useSetConfigMutation = (onCompleted?: () => void) => useMutation<unknown, SetConfigMutationVariables>(SET_CONFIG, {
    refetchQueries: [GET_CONFIG],
    onCompleted
});