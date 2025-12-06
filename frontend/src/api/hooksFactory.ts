/* eslint-disable @typescript-eslint/no-explicit-any */
// hooksFactory.ts

import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { queryClient } from "./queryClient";

/**
 * Query Hook Factory (GET)
 */
export function createQueryHook<TData, TArgs extends any[]>(
  key: string,
  fetcher: (...args: TArgs) => Promise<TData>
) {
  return function useGeneratedQuery(
    args?: TArgs,
    options?: UseQueryOptions<TData>
  ) {
    return useQuery({
      queryKey: args ? [key, ...args] : [key],
      queryFn: () => {
        // Handle undefined args - don't try to spread undefined
        if (!args) {
          return fetcher(...([] as TArgs));
        }
        return fetcher(...(args as TArgs));
      },
      ...options,
    });
  };
}

/**
 * Mutation Hook Factory (POST / PUT / PATCH / DELETE)
 * optional: invalidateKeys: string[]
 */
export function createMutationHook<TData, TArgs extends any[]>(
  key: string,
  fetcher: (...args: TArgs) => Promise<TData>,
  invalidateKeys: string[] = []
) {
  return function useGeneratedMutation(
    options: UseMutationOptions<TData, unknown, TArgs | TArgs[number]> = {}
  ) {
    return useMutation({
      mutationKey: [key],
      mutationFn: (args: any) => {
        // If args is an array, spread it; otherwise wrap in array and spread
        if (Array.isArray(args)) {
          return fetcher(...(args as TArgs));
        }
        return fetcher(...([args] as TArgs));
      },

      // auto invalidation
      onSuccess: (...params) => {
        invalidateKeys.forEach((k) => {
          // Invalidate all queries that start with this key prefix
          queryClient.invalidateQueries({ 
            predicate: (query) => {
              const queryKey = query.queryKey[0];
              return typeof queryKey === 'string' && queryKey.startsWith(k);
            }
          });
        });

        if (options.onSuccess) {
          options.onSuccess(...params);
        }
      },

      ...options,
    });
  };
}
