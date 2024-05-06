import { Args, Int, Resolver, ResolveField, Parent, Query } from "@nestjs/graphql";
import { Comment } from "./entities/comment.entity";
import { CommentService } from "./comment.service";
import { User } from "../user/entities/user.entity";
import { UserService } from "src/user/user.service";

@Resolver((of) => Comment)
export class CommentResolver {
	constructor(
		private readonly commentService: CommentService,
		private readonly userService: UserService
	) {}

	@Query(() => [Comment])
	comments(@Args("post_id", { type: () => Int }) postId: number) {
		return this.commentService.findFor(postId);
	}

	@ResolveField(() => User)
	user(@Parent() comment: Comment) {
		return this.userService.findOne(comment.user_id);
	}
}
