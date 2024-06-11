import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { CreatePostInput } from "./dto/create-post.input";
import { EditPostInput } from "./dto/edit-post.input";
import { Post } from "./entities/post.entity";
import { PostShare } from "./entities/post-share.entity";
import { DatabaseService } from "../db/db.service";
import { QueryConfig } from "pg";
import { BadRequestError } from "../common/errors/bad-request.error";
import { NotFoundError } from "../common/errors/not-found.error";
import { GraphQLError } from "graphql";
import { WhereEqualCondition, appendQueryCondition } from "../common/util/query-condition";
import { UserService } from "../user/user.service";
import { CategoryService } from "../category/category.service";
import { SharePostInput } from "./dto/share-post.input";
import { MediaService } from "../media/media.service";

@Injectable()
export class PostService {
	constructor(
		private readonly db: DatabaseService,
		private readonly userService: UserService,
		private readonly mediaService: MediaService,
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

			if (createPostInput.file_key) {
				await this.mediaService.create(post[0].id, userId, createPostInput.file_key);
			}

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

	async search(query: string): Promise<Post[]> {
		if (!query) {
			return [];
		}

		const searchText = query.trimEnd().split(" ");
		let tsQuery = `${searchText.join(":* | ")}:*`;
		const posts = await this.db.query<Post[]>(
			`
		          SELECT
		          	post.*,
		          	ts_rank(to_tsvector('english', username || ' ' || category_name || ' ' || content), to_tsquery('${tsQuery}')) AS rank
		          FROM
		          	post
		          	INNER JOIN public.user ON post.user_id = public.user.id
		          WHERE
		          	to_tsvector('english', username || ' ' || category_name || ' ' || content) @@ to_tsquery('${tsQuery}')
		          ORDER BY
		          	rank DESC;
		      `
		);

		return posts;
	}

	// TODO: use find all better?
	async findSharedPostFor(userId: string): Promise<PostShare[]> {
		const result = await this.db.query<
			{
				id: number;
				content: string;
				user_id: string;
				category_name: string;
				created_at: Date;
				updated_at: Date;
				share_content: string;
				sharer_id: string;
				shared_at: Date;
			}[]
		>(
			`
            SELECT 
                post.*, 
                user_shares_post.content as share_content, 
                user_shares_post.user_id as sharer_id, 
                user_shares_post.created_at as shared_at 
            FROM post INNER JOIN user_shares_post ON post.id = user_shares_post.post_id 
            WHERE user_shares_post.user_id = '${userId}'
            `
		);

		const postShares: PostShare[] = result.map((res) => ({
			post: {
				id: res.id,
				content: res.content,
				user_id: res.user_id,
				category_name: res.category_name,
				created_at: res.created_at,
				updated_at: res.updated_at
			},
			share_content: res.share_content,
			sharer_id: res.sharer_id,
			shared_at: res.shared_at
		}));

		return postShares;
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

			if (editPostInput.file_key) {
				await this.mediaService.create(editedPost[0].id, userId, editPostInput.file_key);
			}

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

	async userAlreadyShare(postId: number, userId: string): Promise<boolean> {
		if (!postId || !userId) {
			return false;
		}

		try {
			await this.validateInput({ userId, postId });
			const result = await this.db.query<{ user_id: string; post_id: number }[]>(
				`SELECT * FROM public.user_shares_post WHERE user_id = '${userId}' AND post_id = ${postId} LIMIT 1`
			);

			const userSharePost = result[0];
			return userSharePost !== undefined;
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
			const medias = await this.mediaService.findAllFor(postId);

			// remove corresponding media in S3 + table
			await Promise.all(medias.map((media) => this.mediaService.remove(media.id)));

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

	async sharePost(userId: string, sharePostInput: SharePostInput): Promise<Post> {
		try {
			const post = await this.findOne(sharePostInput.postId);
			if (!post) {
				throw new NotFoundError(`Post id ${sharePostInput.postId} not found`);
			}

			if (post.user_id === userId) {
				throw new BadRequestError(`User ${userId} cannot share their own post id ${sharePostInput.postId}`);
			}

			if (await this.userAlreadyShare(sharePostInput.postId, userId)) {
				throw new BadRequestError(`User ${userId} already shares post id ${sharePostInput.postId}`);
			}

			const queries: QueryConfig[] = [
				{
					name: `Share post id ${sharePostInput.postId} by user ${userId}`,
					text: `INSERT INTO public.user_shares_post VALUES ($1, $2, $3, $4)`,
					values: [userId, sharePostInput.postId, sharePostInput.content, new Date()]
				}
			];
			await this.db.transaction(queries);

			return post;
		} catch (e) {
			if (e instanceof GraphQLError) {
				throw e;
			}

			this.logger.error(`error when sharing a post: ${e}`);
			throw new InternalServerErrorException();
		}
	}
}
