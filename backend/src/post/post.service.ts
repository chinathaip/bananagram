import { Injectable } from "@nestjs/common";
import { CreatePostInput } from "./dto/create-post.input";
import { UpdatePostInput } from "./dto/update-post.input";
import { Post } from "./entities/post.entity";
import { DatabaseService } from "../db/db.service";

@Injectable()
export class PostService {
	constructor(private readonly db: DatabaseService) {}

	create(createPostInput: CreatePostInput) {
		return "This action adds a new post";
	}

	async findAll(): Promise<Post[]> {
		const posts = await this.db.query<Post[]>(`SELECT * FROM public.post`);
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
