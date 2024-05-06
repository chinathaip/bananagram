import { graphql } from "@/gql";
import { useSession } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import request from "graphql-request";

const unfollowUserQuery = graphql(`
	mutation Unfollow($id: String!) {
		unfollow(id: $id) {
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
	}
`);

export function useUnfollow() {
	const { session } = useSession();

	return useMutation({
		mutationKey: ["unfollow-user"],
		mutationFn: async (id: string) => {
			const token = await session?.getToken({ template: "supabase" }).then((token) => token || "");

			return request(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/_api/graphql`,
				unfollowUserQuery,
				{
					id
				},
				{ Authorization: `Bearer ${token}` }
			);
		}
	});
}
