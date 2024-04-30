import { graphql } from "@/gql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

const allCategory = graphql(`
	query Category {
		categories {
			id
            name
		}
	}
`);

export function useCategory() {
	return useQuery({
		queryKey: ["category"],
		queryFn: async () => {
			return request("http://localhost:3001/_api/graphql", allCategory);
		}
	});
}
