import type { CodegenConfig } from "@graphql-codegen/cli";
import "dotenv/config";

const config: CodegenConfig = {
	overwrite: true,
	// The backend server must be running for this to work
	schema: `${process.env.NEXT_PUBLIC_BACKEND_URL}/_api/graphql"`,
	documents: ["src/lib/hooks/**/*.ts"],
	generates: {
		"src/gql/": {
			preset: "client",
			plugins: []
		},
		"./graphql.schema.json": {
			plugins: ["introspection"]
		}
	}
};

export default config;
