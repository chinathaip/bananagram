import { graphql } from "@/gql";
import { useSession } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import request from "graphql-request";

const unlikeCommentQuery = graphql(`
	mutation UnlikeComment($id: Int!) {
		unlikeComment(id: $id) {
			id
			likes
		}
	}
`);

export function useUnlikeComment() {
	const { session } = useSession();

	return useMutation({
		mutationKey: ["unlike-comment"],
		mutationFn: async (id: number) => {
			const token = await session?.getToken({ template: "supabase" }).then((token) => token || "");

			return request(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/_api/graphql`,
				unlikeCommentQuery,
				{
					id
				},
				{ Authorization: `Bearer ${token}` }
			);
		}
	});
}
