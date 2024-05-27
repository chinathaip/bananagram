import { graphql } from "@/gql";
import { useMutation } from "@tanstack/react-query";
import request from "graphql-request";
import { useSession } from "@clerk/nextjs";
import { CreatePostInput, EditPostInput } from "@/gql/graphql";

const editPostQuery = graphql(`
	mutation EditPost($editPostInput: EditPostInput!) {
		editPost(editPostInput: $editPostInput) {
			id
			content
		}
	}
`);

export function useEditPost() {
	const { session } = useSession();

	return useMutation({
		mutationKey: ["edit-post"],
		mutationFn: async (editPostInput: EditPostInput) => {
			const token = await session?.getToken({ template: "supabase" }).then((token) => token || "");

			return request(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/_api/graphql`,
				editPostQuery,
				{
					editPostInput
				},
				{ Authorization: `Bearer ${token}` }
			);
		}
	});
}
