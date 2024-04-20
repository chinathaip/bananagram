import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { CreatePostInput } from "./dto/create-post.input";
import { UpdatePostInput } from "./dto/update-post.input";
import { Post } from "./entities/post.entity";
import { DatabaseService } from "../db/db.service";
import { QueryConfig } from "pg";
import { BadRequestError } from "../common/errors/bad-request.error";

@Injectable()
export class PostService {
	constructor(private readonly db: DatabaseService) {}

	private readonly logger = new Logger(PostService.name);

	async create(createPostInput: CreatePostInput): Promise<Post> {
		try {
			const queries: QueryConfig[] = [
				{
					name: `Create New Post for : ${createPostInput.user_id}`,
					text: `INSERT INTO public.post (content, user_id, category_id) VALUES ($1,$2, $3) RETURNING *`,
					values: [createPostInput.content, createPostInput.user_id, createPostInput.category_id]
				}
			];
			const results = await this.db.transaction(queries);
			const post = results[0].rows as Post[];
			return post[0];
		} catch (e) {
			if (e.code == 23503) {
				throw new BadRequestError(`User ${createPostInput.user_id} does not exist`);
			}
			this.logger.error(`error when creating new post: ${e}`);
			throw new InternalServerErrorException();
		}
	}

	async findAll(): Promise<Post[]> {
		const posts = await this.db.query<Post[]>(`SELECT * FROM public.post ORDER BY created_at DESC`);
		return posts;
	}

	findOne(id: number) {
		return `This action returns a #${id} post`;
	}

	update(id: number, updatePostInput: UpdatePostInput) {
		return `This action updates a #${id} post`;
	}

	remove(id: number) {
		return `This action removes a #${id} post`;
	}
}
