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
		categoryId,
		postId,
		isEdit,
		isLike
	}: {
		userId: string;
		categoryId?: number;
		postId?: number;
		isEdit?: boolean;
		isLike?: boolean;
	}) {
		try {
			const promiseResult = await Promise.all([
				// these 3 will throw NotFoundError if the given does not exist
				this.userService.findOne(userId),
				categoryId ? this.categoryService.findOne(categoryId) : null,
				postId ? this.findOne(postId) : null
			]);

			const post = promiseResult[2];
			if (isEdit && post.user_id !== userId) {
				throw new BadRequestError(`User ${userId} does not own post id ${post.id}`);
			}
			if (isLike && post.user_id === userId) {
				throw new BadRequestError(`User ${userId} cannot like his/her own post id ${post.id}`);
			}
		} catch (e) {
			throw e;
		}
	}

	async create(userId: string, createPostInput: CreatePostInput): Promise<Post> {
		try {
			await this.validateInput({ userId, categoryId: createPostInput.category_id });
			const queries: QueryConfig[] = [
				{
					name: `Create New Post for : ${userId}`,
					text: `INSERT INTO public.post (content, user_id, category_id) VALUES ($1,$2, $3) RETURNING *`,
					values: [createPostInput.content, userId, createPostInput.category_id]
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

	async findOne(id: number): Promise<Post> {
		const post = await this.db.query<Post[]>(`SELECT * FROM public.post WHERE id = '${id}' LIMIT 1`);

		if (post.length === 0) {
			throw new NotFoundError(`Post id ${id} not found`);
		}

		return post[0];
	}

	async edit(userId: string, editPostInput: EditPostInput): Promise<Post> {
		try {
			await this.validateInput({
				userId,
				categoryId: editPostInput.category_id,
				postId: editPostInput.id,
				isEdit: true
			});

			const queries: QueryConfig[] = [
				{
					name: `Edit post: ${editPostInput.id} for user: ${userId}`,
					text: `UPDATE public.post SET content = $2, category_id = $3, updated_at = $4 WHERE id = $1 RETURNING *`,
					values: [
						editPostInput.id,
						editPostInput.content,
						editPostInput.category_id,
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

	async likePost(id: number, userId: string): Promise<Post> {
		try {
			await this.validateInput({ userId, postId: id, isLike: true });

			const queries: QueryConfig[] = [
				{
					name: `User ${userId} likes post id ${id}`,
					text: `INSERT INTO public.user_likes_post (user_id, post_id) VALUES ($1, $2) RETURNING *`,
					values: [userId, id]
				},
				{
					name: `Get updated post id ${id} after like`,
					text: `SELECT * FROM public.post WHERE id = $1 LIMIT 1`,
					values: [id]
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
				throw new BadRequestError(`User ${userId} has already liked post id: ${id}`);
			}

			this.logger.error(`error when liking a post: ${e}`);
			throw new InternalServerErrorException();
		}
	}

	remove(id: number) {
		return `This action removes a #${id} post`;
	}
}
