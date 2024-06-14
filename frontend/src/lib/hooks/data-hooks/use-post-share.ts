import { graphql } from "@/gql";
import { useSession } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

const postById = graphql(`
	query PostShare($userId: String!) {
		postShares(user_id: $userId) {
			sharer_id
			share_content
			is_sharer
			shared_at
			post {
				id
				content
				user {
					id
					username
					bio
					email
					following
					followers
					is_following
					is_owner
					created_at
					profile_picture
				}
				medias {
					id
					url
				}
				likes
				comments
				category_name
				created_at
				user_liked
				user_shared
			}
		}
	}
`);

export function usePostShare(userId: string) {
	const { session } = useSession();
	return useQuery({
		queryKey: ["share-post", userId, session ? "withSession" : "withoutSession"],
		queryFn: async () => {
			const token = await session?.getToken({ template: "supabase" }).then((token) => token || "");
			return request(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/_api/graphql`,
				postById,
				{
					userId
				},
				{
					Authorization: `Bearer ${token}`
				}
			);
		}
	});
}
