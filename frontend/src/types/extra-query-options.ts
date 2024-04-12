import type { QueryKey, UseQueryOptions } from "@tanstack/react-query";

// Extract the options type from the useQuery function signature and omit the 'queryKey' property
export type ExtraQueryOptions<TQueryFnData, TError, TData, TQueryKey extends QueryKey> = Omit<
	UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
	"queryKey"
>;
