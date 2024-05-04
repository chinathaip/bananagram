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
			likes
			category_name
			created_at
			user_liked
		}
	}
`);

export function usePost(id: number) {
	// TODO: attach token to see if user has liked the post or not
	return useQuery({
		queryKey: ["allposts", id],
		queryFn: async () =>
			request(`${process.env.NEXT_PUBLIC_BACKEND_URL}/_api/graphql`, postById, {
				id
			})
	});
}
