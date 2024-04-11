import type { QueryKey, UseQueryOptions } from "@tanstack/react-query";

// Extract the options type from the useQuery function signature
export type QueryOptions<TQueryFnData, TError, TData, TQueryKey extends QueryKey> = UseQueryOptions<
	TQueryFnData,
	TError,
	TData,
	TQueryKey
>;
