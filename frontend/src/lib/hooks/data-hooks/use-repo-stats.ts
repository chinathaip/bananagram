import type { ExtraQueryOptions } from "@/types/extra-query-options";
import { RepoStatsSchema, type RepoStats } from "@/types/repo-stats";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";

export function useRepoStats(
	repoUrl: string,
	extraQueryOptions?: ExtraQueryOptions<RepoStats, Error, RepoStats, typeof queryKey>
) {
	const queryKey = ["repo-stats", repoUrl];
	const queryUrl = `https://api.github.com/repos/${repoUrl}`;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const { data } = await axios.get(queryUrl);
			return RepoStatsSchema.parse(data);
		},
		...extraQueryOptions
	});
}
