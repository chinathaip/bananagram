import { graphql } from "@/gql";
import { useSession } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

const postById = graphql(`
	query Post($id: Int!) {
		post(id: $id) {
			id
			content
			user {
				id
				username
				bio
				email
				following
				followers
				is_following
				is_owner
				created_at
				profile_picture
			}
			likes
			comments
			category_name
			created_at
			user_liked
		}
	}
`);

export function usePost(id: number) {
	const { session } = useSession();
	return useQuery({
		queryKey: ["allposts", id, session ? "withSession" : "withoutSession"],
		queryFn: async () => {
			const token = await session?.getToken({ template: "supabase" }).then((token) => token || "");
			return request(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/_api/graphql`,
				postById,
				{
					id
				},
				{
					Authorization: `Bearer ${token}`
				}
			);
		}
	});
}
