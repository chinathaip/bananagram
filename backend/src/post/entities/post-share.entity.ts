import { ObjectType, Field } from "@nestjs/graphql";
import { Post } from "./post.entity";

@ObjectType()
export class PostShare {
	@Field()
	post: Post;

	@Field()
	share_content: string;

	@Field()
	sharer_id: string;

	@Field()
	shared_at: Date;
}
