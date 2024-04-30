import { graphql } from "@/gql";
import { useMutation } from "@tanstack/react-query";
import request from "graphql-request";
import { useSession } from "@clerk/nextjs";
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

	return useMutation({
		mutationKey: ["create-post"],
		mutationFn: async (createPostInput: CreatePostInput) => {
			const token = await session?.getToken({ template: "supabase" }).then((token) => token || "");

			return request(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/_api/graphql`,
				createPostQuery,
				{
					createPostInput
				},
				{ Authorization: `Bearer ${token}` }
			);
		}
	});
}
