import { graphql } from "@/gql";
import { useMutation } from "@tanstack/react-query";
import request from "graphql-request";
import { useSession } from "@clerk/nextjs";
import { useState } from "react";

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
	const [token, setToken] = useState("");

	session?.getToken({ template: "supabase" }).then((token) => setToken(token || ""));

	return useMutation({
		mutationKey: ["follow-user"],
		mutationFn: (id: string) => {
			return request(
				"http://localhost:3001/_api/graphql",
				followUserQuery,
				{
					id
				},
				{ Authorization: `Bearer ${token}` }
			);
		}
	});
}
