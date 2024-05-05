import { graphql } from "@/gql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

const postById = graphql(`
	query Comments($postId: Int!) {
		comments(post_id: $postId) {
			id
			content
			post_id
			user_id
			created_at
			updated_at
		}
	}
`);

export function useComments(postId: number) {
	return useQuery({
		queryKey: ["comments_for_post", postId],
		queryFn: async () =>
			request(`${process.env.NEXT_PUBLIC_BACKEND_URL}/_api/graphql`, postById, {
				postId
			})
	});
}
