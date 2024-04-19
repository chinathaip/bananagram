import { Injectable } from "@nestjs/common";
import { CreatePostInput } from "./dto/create-post.input";
import { UpdatePostInput } from "./dto/update-post.input";
import { Post } from "./entities/post.entity";

@Injectable()
export class PostService {
	create(createPostInput: CreatePostInput) {
		return "This action adds a new post";
	}

	async findAll(): Promise<Post[]> {
		const post = new Post();
		post.id = 1;
		post.content = "hello darkness";
		post.categoryId = 1;
		post.userId = "user_adadad";
		post.createdAt = new Date();
		return [post];
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
