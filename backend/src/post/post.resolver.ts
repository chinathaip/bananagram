import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { PostService } from "./post.service";
import { Post } from "./entities/post.entity";
import { CreatePostInput } from "./dto/create-post.input";
import { UpdatePostInput } from "./dto/update-post.input";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth-jwt.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Resolver((of) => Post)
export class PostResolver {
	constructor(private readonly postService: PostService) {}

	@UseGuards(JwtAuthGuard)
	@Mutation(() => Post)
	createPost(@CurrentUser() userId: string, @Args("createPostInput") createPostInput: CreatePostInput) {
		createPostInput.user_id = userId;
		return this.postService.create(createPostInput);
	}

	@Query(() => [Post])
	posts() {
		return this.postService.findAll();
	}

	@Query(() => Post)
	post(@Args("id", { type: () => Int }) id: number) {
		return this.postService.findOne(id);
	}

	@Mutation(() => Post)
	updatePost(@Args("updatePostInput") updatePostInput: UpdatePostInput) {
		return this.postService.update(updatePostInput.id, updatePostInput);
	}

	@Mutation(() => Post)
	removePost(@Args("id", { type: () => Int }) id: number) {
		return this.postService.remove(id);
	}
}
