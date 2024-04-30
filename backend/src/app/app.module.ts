import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "../user/user.module";
import { AuthModule } from "../auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { PostModule } from "../post/post.module";
import { join } from "path";
import { CommonModule } from "../common/common.module";
import { GraphQLError, GraphQLFormattedError } from "graphql";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		GraphQLModule.forRootAsync<ApolloDriverConfig>({
			driver: ApolloDriver,
			useFactory: (config: ConfigService) => ({
				typePaths: config.get("APP_ENV") === "vercel" ? [join(process.cwd(), "./schema.gql")] : undefined,
				autoSchemaFile: config.get("APP_ENV") !== "vercel" ? join(process.cwd(), "./schema.gql") : undefined,
				path: "/_api/graphql",
				includeStacktraceInErrorResponses: false,
				playground: true,
				introspection: true,
				formatError: (formattedError: GraphQLFormattedError, error: unknown) => {
					if (error instanceof GraphQLError) {
						const graphQLFormattedError = {
							message: error.message,
							code: error.extensions.code
						};
						return graphQLFormattedError;
					}

					return formattedError;
				}
			}),
			inject: [ConfigService]
		}),
		CommonModule,
		UserModule,
		PostModule,
		AuthModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
