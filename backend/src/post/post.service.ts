import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { CreatePostInput } from "./dto/create-post.input";
import { EditPostInput } from "./dto/update-post.input";
import { Post } from "./entities/post.entity";
import { DatabaseService } from "../db/db.service";
import { QueryConfig } from "pg";
import { BadRequestError } from "../common/errors/bad-request.error";
import { NotFoundError } from "../common/errors/not-found.error";
import { GraphQLError } from "graphql";
import { WhereEqualCondition, appendQueryCondition } from "../common/util/query-condition";

@Injectable()
export class PostService {
	constructor(private readonly db: DatabaseService) {}

	private readonly logger = new Logger(PostService.name);

	private async validatePost(postId: number, userId: string) {
		const post = await this.db.query<Post[]>(`SELECT user_id FROM public.post WHERE id=${postId} LIMIT 1`);
		if (!post) {
			throw new NotFoundError("Post with specified id not found");
		}

		if (post[0].user_id != userId) {
			throw new BadRequestError("User does not own this post");
		}
	}

	async create(userId: string, createPostInput: CreatePostInput): Promise<Post> {
		try {
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
			if (e.code == 23503) {
				throw new BadRequestError(`User ${userId} does not exist`);
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
			throw new NotFoundError("Post not found");
		}

		return post[0];
	}

	async update(postId: number, userId: string, editPostInput: EditPostInput): Promise<Post> {
		try {
			await this.validatePost(postId, userId);

			const queries: QueryConfig[] = [
				{
					name: `Edit post: ${postId} for user: ${userId}`,
					text: `UPDATE public.post SET content = $2, category_id = $3 WHERE id = $1 RETURNING *`,
					values: [editPostInput.id, editPostInput.content, editPostInput.category_id]
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

	remove(id: number) {
		return `This action removes a #${id} post`;
	}
}
