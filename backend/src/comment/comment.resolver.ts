import { Args, Int, Resolver, ResolveField, Parent, Query, Mutation } from "@nestjs/graphql";
import { Comment } from "./entities/comment.entity";
import { CommentService } from "./comment.service";
import { User } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard, JwtAuthGuardOptional } from "../auth/auth-jwt.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { PaginationService } from "../common/pagination/pagination.service";
import { EditCommentInput } from "./dto/edit-comment.input";

@Resolver((of) => Comment)
export class CommentResolver {
	constructor(
		private readonly commentService: CommentService,
		private readonly paginationService: PaginationService,
		private readonly userService: UserService
	) {}

	@UseGuards(JwtAuthGuardOptional)
	@Query(() => [Comment])
	comments(@Args("post_id", { type: () => Int }) postId: number) {
		return this.commentService.findFor(postId);
	}

	@ResolveField(() => Int)
	likes(@Parent() comment: Comment) {
		return this.paginationService.getItemCountFor("user_likes_comment", [
			{ where: "comment_id", equals: comment.id }
		]);
	}

	@ResolveField(() => Boolean)
	user_liked(@CurrentUser() userId: string, @Parent() comment: Comment) {
		return this.commentService.checkUserLike(comment.id, userId);
	}

	@ResolveField(() => User)
	user(@Parent() comment: Comment) {
		return this.userService.findOne(comment.user_id);
	}

	@UseGuards(JwtAuthGuard)
	@Mutation(() => Comment)
	editComment(@CurrentUser() userId: string, @Args("editCommentInput") editCommentInput: EditCommentInput) {
		return this.commentService.update(userId, editCommentInput);
	}

	@UseGuards(JwtAuthGuard)
	@Mutation(() => Comment)
	likeComment(@CurrentUser() userId: string, @Args("id", { type: () => Int }) id: number) {
		return this.commentService.likeComment(id, userId);
	}

	@UseGuards(JwtAuthGuard)
	@Mutation(() => Comment)
	unlikeComment(@CurrentUser() userId: string, @Args("id", { type: () => Int }) id: number) {
		return this.commentService.unlikeComment(id, userId);
	}
}
