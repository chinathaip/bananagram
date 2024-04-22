import { graphql } from "@/gql";
import { useMutation } from "@tanstack/react-query";
import request from "graphql-request";
import { useSession } from "@clerk/nextjs";
import { useState } from "react";

const likePostQuery = graphql(`
	mutation LikePost($id: Int!) {
		likePost(id: $id) {
			id
			likes
		}
	}
`);

export function useLikePost() {
	const { session } = useSession();
	const [token, setToken] = useState("");
	session?.getToken({ template: "supabase" }).then((token) => setToken(token || ""));

	return useMutation({
		mutationKey: ["like-post"],
		mutationFn: (id: number) => {
			return request(
				"http://localhost:3001/_api/graphql",
				likePostQuery,
				{
					id
				},
				{ Authorization: `Bearer ${token}` }
			);
		}
	});
}
