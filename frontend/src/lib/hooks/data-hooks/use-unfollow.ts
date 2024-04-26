import { graphql } from "@/gql";
import { useMutation } from "@tanstack/react-query";
import request from "graphql-request";
import { useSession } from "@clerk/nextjs";
import { useState } from "react";

const unfollowUserQuery = graphql(`
	mutation Unfollow($id: String!) {
		unfollow(id: $id) {
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

export function useUnfollow() {
	const { session } = useSession();
	const [token, setToken] = useState("");

	session?.getToken({ template: "supabase" }).then((token) => setToken(token || ""));

	return useMutation({
		mutationKey: ["unfollow-user"],
		mutationFn: (id: string) => {
			return request(
				"http://localhost:3001/_api/graphql",
				unfollowUserQuery,
				{
					id
				},
				{ Authorization: `Bearer ${token}` }
			);
		}
	});
}
