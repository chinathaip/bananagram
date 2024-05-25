import { graphql } from "@/gql";
import { useSession } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

const commentById = graphql(`
	query Comments($postId: Int!) {
		comments(post_id: $postId) {
			id
			content
			post_id
			user_liked
			likes
			created_at
			updated_at
			user {
				id
				username
				is_owner
				created_at
				profile_picture
			}
		}
	}
`);

export function useComments(postId: number) {
	const { session } = useSession();
	return useQuery({
		queryKey: ["comments_for_post", postId, session ? "withSession" : "withoutSession"],
		queryFn: async () => {
			const token = await session?.getToken({ template: "supabase" }).then((token) => token || "");
			return request(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/_api/graphql`,
				commentById,
				{
					postId
				},
				{
					Authorization: `Bearer ${token}`
				}
			);
		}
	});
}
