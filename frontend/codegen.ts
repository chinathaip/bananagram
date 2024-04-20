import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	overwrite: true,
	// The backend server must be running for this to work
	schema: "http://localhost:3001/_api/graphql",
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
