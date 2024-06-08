import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { PostShare } from "./entities/post-share.entity";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuardOptional } from "src/auth/auth-jwt.guard";
import { PostService } from "./post.service";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";

@Resolver((of) => PostShare)
export class PostShareResolver {
	constructor(private readonly postService: PostService) {}

	@UseGuards(JwtAuthGuardOptional)
	@Query(() => [PostShare])
	postShares(@Args("user_id") userId: string) {
		return this.postService.findSharedPostFor(userId);
	}

	@ResolveField(() => Boolean)
	is_sharer(@CurrentUser() userId: string, @Parent() postShare: PostShare) {
		return userId === postShare.sharer_id;
	}
}
