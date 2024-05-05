import { Args, Int, Resolver, Query } from "@nestjs/graphql";
import { Comment } from "./entities/comment.entity";
import { CommentService } from "./comment.service";

@Resolver((of) => Comment)
export class CommentResolver {
	constructor(private readonly commentService: CommentService) {}

	@Query(() => [Comment])
	comments(@Args("post_id", { type: () => Int }) postId: number) {
		return this.commentService.findFor(postId);
	}
}
