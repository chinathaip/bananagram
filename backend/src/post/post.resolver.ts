import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from "@nestjs/graphql";
import { PostService } from "./post.service";
import { Post } from "./entities/post.entity";
import { CreatePostInput } from "./dto/create-post.input";
import { EditPostInput } from "./dto/update-post.input";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth-jwt.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Category } from "../category/entities/category.entity";
import { CategoryService } from "../category/category.service";
import { User } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";

@Resolver((of) => Post)
export class PostResolver {
	constructor(
		private readonly postService: PostService,
		private readonly categoryService: CategoryService,
		private readonly userService: UserService
	) {}

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

	@ResolveField(() => User)
	user(@Parent() post: Post) {
		return this.userService.findOne(post.user_id);
	}

	@ResolveField(() => Category)
	category(@Parent() post: Post) {
		return this.categoryService.findOne(post.category_id);
	}

	@UseGuards(JwtAuthGuard)
	@Mutation(() => Post)
	editPost(@CurrentUser() userId: string, @Args("editPostInput") editPostInput: EditPostInput) {
		return this.postService.update(editPostInput.id, userId, editPostInput);
	}

	@Mutation(() => Post)
	removePost(@Args("id", { type: () => Int }) id: number) {
		return this.postService.remove(id);
	}
}
