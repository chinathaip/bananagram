import { graphql } from "@/gql";
import { useSession } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

const userById = graphql(`
	query User($id: String!) {
		user(id: $id) {
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

export function useUser(id: string = "") {
	const { session } = useSession();

	return useQuery({
		queryKey: ["user", id],
		queryFn: async () => {
			const token = await session?.getToken({ template: "supabase" }).then((token) => token || "");

			return request(
				"http://localhost:3001/_api/graphql",
				userById,
				{ id },
				{ Authorization: `Bearer ${token}` }
			);
		}
	});
}
