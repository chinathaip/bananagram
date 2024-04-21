import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from "@nestjs/graphql";
import { PostService } from "./post.service";
import { Post } from "./entities/post.entity";
import { CreatePostInput } from "./dto/create-post.input";
import { EditPostInput } from "./dto/edit-post.input";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth-jwt.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Category } from "../category/entities/category.entity";
import { CategoryService } from "../category/category.service";
import { User } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { PaginationService } from "../common/pagination/pagination.service";

@Resolver((of) => Post)
export class PostResolver {
	constructor(
		private readonly postService: PostService,
		private readonly categoryService: CategoryService,
		private readonly userService: UserService,
		private readonly paginationService: PaginationService
	) {}

	@UseGuards(JwtAuthGuard)
	@Mutation(() => Post)
	createPost(@CurrentUser() userId: string, @Args("createPostInput") createPostInput: CreatePostInput) {
		return this.postService.create(userId, createPostInput);
	}

	@Query(() => Post)
	post(@Args("id", { type: () => Int }) id: number) {
		return this.postService.findOne(id);
	}

	@ResolveField(() => User)
	user(@Parent() post: Post) {
		return this.userService.findOne(post.user_id);
	}

	@ResolveField(() => Int)
	likes(@Parent() post: Post) {
		// potential issue if the number of likes are high
		// should denormalize creating an additional number_of_likes attribute on post entity and have 2 triggers that update it
		return this.paginationService.getItemCountFor("user_likes_post", [{ where: "post_id", equals: post.id }]);
	}

	@ResolveField(() => Category)
	category(@Parent() post: Post) {
		return this.categoryService.findOne(post.category_id);
	}

	@UseGuards(JwtAuthGuard)
	@Mutation(() => Post)
	editPost(@CurrentUser() userId: string, @Args("editPostInput") editPostInput: EditPostInput) {
		return this.postService.edit(userId, editPostInput);
	}

	@UseGuards(JwtAuthGuard)
	@Mutation(() => Post)
	likePost(@CurrentUser() userId: string, @Args("id", { type: () => Int }) id: number) {
		return this.postService.likePost(id, userId);
	}

	@Mutation(() => Post)
	removePost(@Args("id", { type: () => Int }) id: number) {
		return this.postService.remove(id);
	}
}
