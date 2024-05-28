import { graphql } from "@/gql";
import { useMutation } from "@tanstack/react-query";
import request from "graphql-request";
import { useSession } from "@clerk/nextjs";

const deletePostQuery = graphql(`
	mutation DeletePost($id: Int!) {
		removePost(id: $id) {
			id
			content
		}
	}
`);

export function useDeletePost() {
	const { session } = useSession();

	return useMutation({
		mutationKey: ["delete-post"],
		mutationFn: async (id: number) => {
			const token = await session?.getToken({ template: "supabase" }).then((token) => token || "");

			return request(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/_api/graphql`,
				deletePostQuery,
				{
					id
				},
				{ Authorization: `Bearer ${token}` }
			);
		}
	});
}
