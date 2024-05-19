import { graphql } from "@/gql";
import { useSession } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import request from "graphql-request";

const unlikePostQuery = graphql(`
	mutation UnlikePost($id: Int!) {
		unlikePost(id: $id) {
			id
			likes
		}
	}
`);

export function useUnlikePost() {
	const { session } = useSession();

	return useMutation({
		mutationKey: ["like-post"],
		mutationFn: async (id: number) => {
			const token = await session?.getToken({ template: "supabase" }).then((token) => token || "");

			return request(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/_api/graphql`,
				unlikePostQuery,
				{
					id
				},
				{ Authorization: `Bearer ${token}` }
			);
		}
	});
}
