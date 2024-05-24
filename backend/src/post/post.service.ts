import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { CreatePostInput } from "./dto/create-post.input";
import { EditPostInput } from "./dto/edit-post.input";
import { Post } from "./entities/post.entity";
import { DatabaseService } from "../db/db.service";
import { QueryConfig } from "pg";
import { BadRequestError } from "../common/errors/bad-request.error";
import { NotFoundError } from "../common/errors/not-found.error";
import { GraphQLError } from "graphql";
import { WhereEqualCondition, appendQueryCondition } from "../common/util/query-condition";
import { UserService } from "../user/user.service";
import { CategoryService } from "../category/category.service";

@Injectable()
export class PostService {
	constructor(
		private readonly db: DatabaseService,
		private readonly userService: UserService,
		private readonly categoryService: CategoryService
	) {}

	private readonly logger = new Logger(PostService.name);

	private async validateInput({
		userId,
		categoryName,
		postId,
		isEdit
	}: {
		userId: string;
		categoryName?: string;
		postId?: number;
		isEdit?: boolean;
	}) {
		try {
			const promiseResult = await Promise.all([
				// these 3 will throw NotFoundError if the given does not exist
				this.userService.findOne(userId),
				categoryName ? this.categoryService.findOne(categoryName) : null,
				postId ? this.findOne(postId) : null
			]);

			const post = promiseResult[2];
			if (isEdit && post.user_id !== userId) {
				throw new BadRequestError(`User ${userId} does not own post id ${post.id}`);
			}
		} catch (e) {
			throw e;
		}
	}

	async create(userId: string, createPostInput: CreatePostInput): Promise<Post> {
		try {
			await this.validateInput({
				userId,
				categoryName: createPostInput.category_name
			});
			const queries: QueryConfig[] = [
				{
					name: `Create New Post for : ${userId}`,
					text: `INSERT INTO public.post (content, user_id, category_name, created_at) VALUES ($1,$2, $3, $4) RETURNING *`,
					values: [createPostInput.content, userId, createPostInput.category_name, new Date()]
				}
			];
			const results = await this.db.transaction(queries);
			const post = results[0].rows as Post[];
			return post[0];
		} catch (e) {
			if (e instanceof GraphQLError) {
				throw e;
			}
			this.logger.error(`error when creating new post: ${e}`);
			throw new InternalServerErrorException();
		}
	}

	async findAll(conditions: WhereEqualCondition[], limit: number, offset: number): Promise<Post[]> {
		let statement = appendQueryCondition(`SELECT * FROM public.post`, conditions);
		const posts = await this.db.query<Post[]>(
			(statement += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`)
		);
		return posts;
	}

	async findOne(postId: number): Promise<Post> {
		const post = await this.db.query<Post[]>(`SELECT * FROM public.post WHERE id = '${postId}' LIMIT 1`);

		if (post.length === 0) {
			throw new NotFoundError(`Post id ${postId} not found`);
		}

		return post[0];
	}

	async edit(userId: string, editPostInput: EditPostInput): Promise<Post> {
		try {
			await this.validateInput({
				userId,
				categoryName: editPostInput.category_name,
				postId: editPostInput.id,
				isEdit: true
			});

			const queries: QueryConfig[] = [
				{
					name: `Edit post: ${editPostInput.id} for user: ${userId}`,
					text: `UPDATE public.post SET content = $2, category_name = $3, updated_at = $4 WHERE id = $1 RETURNING *`,
					values: [
						editPostInput.id,
						editPostInput.content,
						editPostInput.category_name,
						editPostInput.updated_at ?? new Date()
					]
				}
			];
			const results = await this.db.transaction(queries);
			const editedPost = results[0].rows as Post[];
			return editedPost[0];
		} catch (e) {
			if (e instanceof GraphQLError) {
				throw e;
			}

			this.logger.error(`error when creating new post: ${e}`);
			throw new InternalServerErrorException();
		}
	}

	async checkUserLike(postId: number, userId: string): Promise<Boolean> {
		if (!userId) {
			return false;
		}

		try {
			await this.validateInput({ userId, postId });

			const result = await this.db.query<{ user_id: string; post_id: number }[]>(
				`SELECT * FROM public.user_likes_post WHERE user_id = '${userId}' AND post_id = ${postId} LIMIT 1`
			);

			const userLikePost = result[0];
			return userLikePost !== undefined;
		} catch (e) {
			if (e instanceof GraphQLError) {
				throw e;
			}

			this.logger.error(`error when querying user_likes_post: ${e}`);
			throw new InternalServerErrorException();
		}
	}

	async likePost(postId: number, userId: string): Promise<Post> {
		try {
			await this.validateInput({ userId, postId });

			const queries: QueryConfig[] = [
				{
					name: `User ${userId} likes post id ${postId}`,
					text: `INSERT INTO public.user_likes_post (user_id, post_id) VALUES ($1, $2) RETURNING *`,
					values: [userId, postId]
				},
				{
					name: `Get updated post id ${postId} after like`,
					text: `SELECT * FROM public.post WHERE id = $1 LIMIT 1`,
					values: [postId]
				}
			];

			const results = await this.db.transaction(queries);
			const post = results[1].rows as Post[];
			return post[0];
		} catch (e) {
			if (e instanceof GraphQLError) {
				throw e;
			}
			if (e.code === "23505") {
				// 23505 = duplicate key constraint
				throw new BadRequestError(`User ${userId} has already liked post id: ${postId}`);
			}

			this.logger.error(`error when liking a post: ${e}`);
			throw new InternalServerErrorException();
		}
	}

	async unlikePost(postId: number, userId: string): Promise<Post> {
		try {
			await this.validateInput({ userId, postId });

			const queries: QueryConfig[] = [
				{
					name: `User ${userId} unlikes post id ${postId}`,
					text: `DELETE FROM public.user_likes_post WHERE user_id = $1 AND post_id = $2`,
					values: [userId, postId]
				},
				{
					name: `Get updated post id ${postId} after unlike`,
					text: `SELECT * FROM public.post WHERE id = $1 LIMIT 1`,
					values: [postId]
				}
			];

			const results = await this.db.transaction(queries);
			const post = results[1].rows as Post[];
			return post[0];
		} catch (e) {
			if (e instanceof GraphQLError) {
				throw e;
			}

			this.logger.error(`error when unliking a post: ${e}`);
			throw new InternalServerErrorException();
		}
	}

	async remove(postId: number, userId: string): Promise<Post> {
		try {
			const postToDelete = await this.findOne(postId);
			if (userId == postToDelete.user_id) {
				const queries: QueryConfig[] = [
					{
						name: `Delete post id ${postId} by user ${userId}`,
						text: `Delete from public.post WHERE id = $1 AND user_id = $2 RETURNING *`,
						values: [postId, userId]
					}
				];

				const results = await this.db.transaction(queries);
				const post = results[0].rows as Post[];
				return post[0];
			}
		} catch (e) {
			if (e instanceof GraphQLError) {
				throw e;
			}

			this.logger.error(`error when liking a post: ${e}`);
			throw new InternalServerErrorException();
		}
		return;
	}
}
