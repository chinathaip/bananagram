import { graphql } from "@/gql";
import { useMutation } from "@tanstack/react-query";
import request from "graphql-request";
import { useSession } from "@clerk/nextjs";
import { useState } from "react";
import { CreatePostInput } from "@/gql/graphql";

const createPostQuery = graphql(`
	mutation CreatePost($createPostInput: CreatePostInput!) {
		createPost(createPostInput: $createPostInput) {
			id
			content
		}
	}
`);

export function useCreatePost() {
	const { session } = useSession();
	const [token, setToken] = useState("");

	session?.getToken({ template: "supabase" }).then((token) => setToken(token || ""));

	return useMutation({
		mutationKey: ["create-post"],
		mutationFn: (createPostInput: CreatePostInput) => {
			return request(
				"http://localhost:3001/_api/graphql",
				createPostQuery,
				{
					createPostInput
				},
				{ Authorization: `Bearer ${token}` }
			);
		}
	});
}
