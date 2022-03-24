import { MutationHookOptions, useMutation } from "@apollo/client";
import { loader } from "graphql.macro";
import { BrowserExtension, Mutation, MutationSetActiveBrowserExtensionArgs } from "../../../generated/graphql";

export const SET_ACTIVE_BROWSER_EXTENSION = loader('./../graphql/SetActiveBrowserExtension.mutation.graphql');

export const useSetActiveBrowserExtensionMutation = (options?: MutationHookOptions) => 
    // TODO: specify all mutations to use generated type definitions such as `MutationSetActiveBrowserExtensionArgs`
    useMutation<Mutation['setActiveBrowserExtension'], MutationSetActiveBrowserExtensionArgs>(
        SET_ACTIVE_BROWSER_EXTENSION, 
        {
            notifyOnNetworkStatusChange: true,
            ...options
        }
    );