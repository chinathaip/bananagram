import { graphql } from "@/gql";
import { SignedUrlInput } from "@/gql/graphql";
import { useSession } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import request from "graphql-request";

const signedUrlMutation = graphql(`
	mutation SignedUrl($signedUrlInput: SignedUrlInput!) {
		signedUrl(signedUrlInput: $signedUrlInput) {
			url
			mediaId
		}
	}
`);

export function useSignedUrl() {
	const { session, isLoaded } = useSession();

	return useMutation({
		mutationKey: ["signedUrl", isLoaded],
		mutationFn: async (signedUrlInput: SignedUrlInput) => {
			const token = await session?.getToken({ template: "supabase" }).then((token) => token || "");
			return request(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/_api/graphql`,
				signedUrlMutation,
				{ signedUrlInput },
				{
					Authorization: `Bearer ${token}`
				}
			);
		}
	});
}
