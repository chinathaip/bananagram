import { graphql } from "@/gql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

const allPosts = graphql(`
	query allPosts {
		posts {
			id
			content
		}
	}
`);

export function useAllPosts() {
	return useQuery({
		queryKey: ["allposts"],
		queryFn: async () => request("http://localhost:3001/_api/graphql", allPosts)
	});
}
