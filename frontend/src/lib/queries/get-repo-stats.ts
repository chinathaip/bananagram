import { QueryOptions } from "@/types/query-options";
import { RepoStats, RepoStatsSchema } from "@/types/repo-stats";

const queryKey = ["github-stats"];
const queryFn = async () => {
	const response = await fetch("https://api.github.com/repos/TanStack/query");
	const data = await response.json();
	return RepoStatsSchema.parse(data);
};

export const getRepoStatsQuery: QueryOptions<RepoStats, Error, RepoStats, typeof queryKey> = {
	queryKey,
	queryFn
};
