import { Injectable } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { DatabaseService } from "src/db/db.service";
import { QueryConfig } from "pg";
import { Comment } from "./entities/comment.entity";

@Injectable()
export class CommentService {
	constructor(private readonly db: DatabaseService) {}

	async create(userId: string, createCommentDto: CreateCommentDto): Promise<Comment> {
		// INSERT INTO public.comment (content, post_id, user_id) VALUES ('Me too....', 1, 'user_2f02EDTfrcAuyhODlRHaNLP6LQQ');
		// INSERT INTO public.comment (content, post_id, user_id) VALUES ('sure, but dockerize it yourself', 1, 'user_2f2BNrbARuhvr1M84Jq4kALpw9O');

		const queries: QueryConfig[] = [
			{
				name: `New message for post ${createCommentDto.postId} from ${userId}`,
				text: `INSERT INTO public.comment (content, post_id, user_id) VALUES ($1, $2, $3) RETURNING *`,
				values: [createCommentDto.content, createCommentDto.postId, userId]
			}
		];
		const results = await this.db.transaction(queries);
		const comment = results[0].rows as Comment[];
		return comment[0];
	}

	async findFor(postId: number): Promise<Comment[]> {
		const results = await this.db.query<Comment[]>(`SELECT * FROM public.comment WHERE post_id = ${postId}`);
		return results;
	}

	update(id: number, updateCommentDto: UpdateCommentDto) {
		return `This action updates a #${id} comment`;
	}

	remove(id: number) {
		return `This action removes a #${id} comment`;
	}
}
