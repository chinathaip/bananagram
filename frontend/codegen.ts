import type { CodegenConfig } from "@graphql-codegen/cli";
import "dotenv/config";

const config: CodegenConfig = {
	overwrite: true,
	// The backend server must be running for this to work
	// schema: "http://localhost:3001/_api/graphql",
	schema: "https://ite442-be.stamford.dev/_api/graphql",
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
