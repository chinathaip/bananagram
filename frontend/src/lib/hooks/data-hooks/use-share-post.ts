import { graphql } from "@/gql";
import { useMutation } from "@tanstack/react-query";
import request from "graphql-request";
import { useSession } from "@clerk/nextjs";
import { CreatePostInput, SharePostInput } from "@/gql/graphql";

const sharePostQuery = graphql(`
	mutation SharePost($sharePostInput: SharePostInput!) {
		sharePost(sharePostInput: $sharePostInput) {
			id
		}
	}
`);

export function useSharePost() {
	const { session } = useSession();

	return useMutation({
		mutationKey: ["share-post"],
		mutationFn: async (sharePostInput: SharePostInput) => {
			const token = await session?.getToken({ template: "supabase" }).then((token) => token || "");

			return request(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/_api/graphql`,
				sharePostQuery,
				{
					sharePostInput
				},
				{ Authorization: `Bearer ${token}` }
			);
		}
	});
}
