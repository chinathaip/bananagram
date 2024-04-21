import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "../user/user.module";
import { AuthModule } from "../auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { PostModule } from "../post/post.module";
import { join } from "path";
import { CommonModule } from "../common/common.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: join(process.cwd(), "./schema.gql"),
			path: "/_api/graphql"
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
