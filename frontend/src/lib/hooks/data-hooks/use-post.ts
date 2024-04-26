import { graphql } from "@/gql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

const postById = graphql(`
	query Post($id: Int!) {
		post(id: $id) {
			id
			content
			user {
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
			category {
				name
			}
		}
	}
`);

export function usePost(id: number) {
	return useQuery({
		queryKey: ["allposts", id],
		queryFn: async () =>
			request("http://localhost:3001/_api/graphql", postById, {
				id
			})
	});
}
