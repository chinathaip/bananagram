import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { DatabaseService } from "../db/db.service";
import { QueryConfig } from "pg";
import { Comment } from "./entities/comment.entity";
import { GraphQLError } from "graphql";
import { BadRequestError } from "../common/errors/bad-request.error";

@Injectable()
export class CommentService {
	constructor(private readonly db: DatabaseService) {}

	private readonly logger = new Logger(CommentService.name);

	async create(userId: string, createCommentDto: CreateCommentDto): Promise<Comment> {
		const queries: QueryConfig[] = [
			{
				name: `New message for post ${createCommentDto.postId} from ${userId}`,
				text: `INSERT INTO public.comment (content, post_id, user_id, created_at) VALUES ($1, $2, $3, $4) RETURNING *`,
				values: [createCommentDto.content, createCommentDto.postId, userId, new Date()]
			}
		];
		const results = await this.db.transaction(queries);
		const comment = results[0].rows as Comment[];
		return comment[0];
	}

	async findFor(postId: number): Promise<Comment[]> {
		const results = await this.db.query<Comment[]>(
			`SELECT * FROM public.comment WHERE post_id = ${postId} ORDER BY created_at DESC`
		);
		return results;
	}

	async likeComment(commentId: number, userId: string): Promise<Comment> {
		try {
			const queries: QueryConfig[] = [
				{
					name: `User ${userId} likes comment id ${commentId}`,
					text: `INSERT INTO public.user_likes_comment (user_id, comment_id) VALUES ($1, $2)`,
					values: [userId, commentId]
				},
				{
					name: `Get updated comment id ${commentId} after like`,
					text: `SELECT * FROM public.comment WHERE id = $1 LIMIT 1`,
					values: [commentId]
				}
			];

			const results = await this.db.transaction(queries);
			const comment = results[1].rows as Comment[];
			return comment[0];
		} catch (e) {
			if (e instanceof GraphQLError) {
				throw e;
			}

			if (e.code === "23505") {
				throw new BadRequestError(`User ${userId} has already liked comment id: ${commentId}`);
			}

			this.logger.error(`error when liking a comment: ${e}`);
			throw new InternalServerErrorException();
		}
	}

	async unlikeComment(commentId: number, userId: string): Promise<Comment> {
		try {
			const queries: QueryConfig[] = [
				{
					name: `User ${userId} unlikes comment id ${commentId}`,
					text: `DELETE FROM public.user_likes_comment WHERE user_id = $1 AND comment_id = $2`,
					values: [userId, commentId]
				},
				{
					name: `Get updated comment id ${commentId} after unlike`,
					text: `SELECT * FROM public.comment WHERE id = $1 LIMIT 1`,
					values: [commentId]
				}
			];

			const results = await this.db.transaction(queries);
			const comment = results[1].rows as Comment[];
			return comment[0];
		} catch (e) {
			if (e instanceof GraphQLError) {
				throw e;
			}

			this.logger.error(`error when unliking a post: ${e}`);
			throw new InternalServerErrorException();
		}
	}

	async checkUserLike(commentId: number, userId: string): Promise<Boolean> {
		if (!userId) {
			return false;
		}

		try {
			const result = await this.db.query<{ user_id: string; post_id: number }[]>(
				`SELECT * FROM public.user_likes_comment WHERE user_id = '${userId}' AND comment_id = ${commentId} LIMIT 1`
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

	update(id: number, updateCommentDto: UpdateCommentDto) {
		return `This action updates a #${id} comment`;
	}

	remove(id: number) {
		return `This action removes a #${id} comment`;
	}
}
