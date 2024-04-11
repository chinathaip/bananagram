import z from "zod";

export const RepoStatsSchema = z.object({
	id: z.number(),
	name: z.string(),
	stargazers_count: z.number()
});

export type RepoStats = z.infer<typeof RepoStatsSchema>;
