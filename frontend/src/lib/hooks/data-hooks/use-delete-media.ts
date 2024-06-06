import { graphql } from "@/gql";
import { useMutation } from "@tanstack/react-query";
import request from "graphql-request";
import { useSession } from "@clerk/nextjs";

const deleteMediaQuery = graphql(`
	mutation DeleteMedia($id: String!) {
		removeMedia(id: $id) {
			id
			url
			post_id
		}
	}
`);

export function useDeleteMedia() {
	const { session } = useSession();

	return useMutation({
		mutationKey: ["delete-media"],
		mutationFn: async (id: string) => {
			const token = await session?.getToken({ template: "supabase" }).then((token) => token || "");

			return request(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/_api/graphql`,
				deleteMediaQuery,
				{
					id
				},
				{ Authorization: `Bearer ${token}` }
			);
		}
	});
}
