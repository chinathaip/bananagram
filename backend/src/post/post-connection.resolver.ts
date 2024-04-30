import { Resolver, Query, Args } from "@nestjs/graphql";
import { PostConnection } from "./connection/post.connection";
import { PostConnectionArgs } from "./dto/post-args.input";
import { PostConnectionBuilder } from "./connection/post.connection.builder";
import { PostService } from "./post.service";
import { PaginationService } from "../common/pagination/pagination.service";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuardOptional } from "../auth/auth-jwt.guard";

@Resolver((of) => PostConnection)
export class PostConnectionResolver {
	constructor(
		private readonly postService: PostService,
		private readonly paginationService: PaginationService
	) {}

	@UseGuards(JwtAuthGuardOptional)
	@Query(() => PostConnection)
	async posts(@Args() connectionArgs: PostConnectionArgs) {
		const queryConditions = [
			{
				where: "category_id",
				equals: connectionArgs.category_id
			},
			{
				where: "user_id",
				equals: connectionArgs.user_id
			}
		];
		const connectionBuilder = new PostConnectionBuilder(connectionArgs, {
			defaultEdgesPerPage: 10,
			maxEdgesPerPage: 10
		});
		const totalEdges = await this.paginationService.getItemCountFor("post", queryConditions);

		const limit = connectionBuilder.edgesPerPage;
		const offset = connectionBuilder.startOffset;

		const posts = await this.postService.findAll(queryConditions, limit, offset);

		return connectionBuilder.build({
			totalEdges,
			nodes: posts
		});
	}
}
