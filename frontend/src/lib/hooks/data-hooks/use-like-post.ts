import { graphql } from "@/gql";
import { useSession } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import request from "graphql-request";

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

	return useMutation({
		mutationKey: ["like-post"],
		mutationFn: async (id: number) => {
			const token = await session?.getToken({ template: "supabase" }).then((token) => token || "");

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
