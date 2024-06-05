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
import { CommentModule } from "../comment/comment.module";
import { S3Module } from "../s3/s3.module";
import { MediaModule } from "../media/media.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		GraphQLModule.forRootAsync<ApolloDriverConfig>({
			driver: ApolloDriver,
			useFactory: (config: ConfigService) => ({
				autoSchemaFile: join(process.cwd(), "./schema.gql"),
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
		AuthModule,
		CommentModule,
		S3Module,
		MediaModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
