import { graphql } from "@/gql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

const userById = graphql(`
	query User($id: String!) {
		user(id: $id) {
			id
			username
			bio
			email
			display_name
			is_owner
			created_at
			profile_picture
		}
	}
`);

export function useUser(id: string, token: string) {
	return useQuery({
		queryKey: ["user", id],
        gcTime: Infinity,
		queryFn: async () => {
			return request(
				"http://localhost:3001/_api/graphql",
				userById,
				{
					id
				},
				{ Authorization: `Bearer ${token}` }
			);
		}
	});
}
