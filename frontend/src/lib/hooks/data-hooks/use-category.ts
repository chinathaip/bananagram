import { graphql } from "@/gql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

const allCategory = graphql(`
	query Category {
		categories {
			name
		}
	}
`);

export function useCategory() {
	return useQuery({
		queryKey: ["category"],
		queryFn: async () => {
			return request(`${process.env.NEXT_PUBLIC_BACKEND_URL}/_api/graphql`, allCategory);
		}
	});
}
