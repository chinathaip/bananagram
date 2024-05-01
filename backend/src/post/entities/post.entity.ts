import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class Post {
	@Field((type) => Int)
	id: number;

	@Field()
	content: string;

	@Field({ description: "The user who created this post" })
	user_id: string;

	@Field({ description: "The type of category this post belongs to" })
	category_name: string;

	@Field()
	created_at: Date;

	@Field({ nullable: true })
	updated_at?: Date;
}
