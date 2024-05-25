import { graphql } from "@/gql";
import { useSession } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import request from "graphql-request";

const likeCommentQuery = graphql(`
	mutation LikeComment($id: Int!) {
		likeComment(id: $id) {
			id
			likes
		}
	}
`);

export function useLikeComment() {
	const { session } = useSession();

	return useMutation({
		mutationKey: ["like-comment"],
		mutationFn: async (id: number) => {
			const token = await session?.getToken({ template: "supabase" }).then((token) => token || "");

			return request(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/_api/graphql`,
				likeCommentQuery,
				{
					id
				},
				{ Authorization: `Bearer ${token}` }
			);
		}
	});
}
