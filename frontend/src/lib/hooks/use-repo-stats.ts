import { RepoStatsSchema } from "@/types/repo-stats";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useRepoStats(repoUrl: string) {
	const queryKey = ["repo-stats", repoUrl];
	const queryUrl = `https://api.github.com/repos/${repoUrl}`;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const { data } = await axios.get(queryUrl);
			return RepoStatsSchema.parse(data);
		}
	});
}
