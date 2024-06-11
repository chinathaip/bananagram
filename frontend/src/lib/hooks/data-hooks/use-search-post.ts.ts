import { graphql } from "@/gql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

const searchPostQuery = graphql(`
	query Search($query: String!) {
		search(query: $query) {
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
			user_id
			user_liked
			user_shared
		}
	}
`);

export function useSearchPost(query: string) {
	return useQuery({
		queryKey: ["search-posts", query],
		queryFn: async () => {
			return request(`${process.env.NEXT_PUBLIC_BACKEND_URL}/_api/graphql`, searchPostQuery, { query });
		}
	});
}
