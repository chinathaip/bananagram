import { graphql } from "@/gql";
import { useSession } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import request from "graphql-request";

const followUserQuery = graphql(`
	mutation Follow($id: String!) {
		follow(id: $id) {
			id
			username
			bio
			email
			following
			followers
			display_name
			is_following
			is_owner
			created_at
			profile_picture
		}
	}
`);

export function useFollow() {
	const { session } = useSession();

	return useMutation({
		mutationKey: ["follow-user"],
		mutationFn: async (id: string) => {
			// Fetch the token directly in the mutation function
			const token = await session?.getToken({ template: "supabase" }).then((token) => token || "");

			return request(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/_api/graphql`,
				followUserQuery,
				{ id },
				{ Authorization: `Bearer ${token}` }
			);
		}
	});
}
