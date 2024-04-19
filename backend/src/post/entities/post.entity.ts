import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class Post {
	@Field((type) => Int)
	id: number;

	@Field()
	content: string;

	@Field({ description: "The user who created this post" })
	user_id: string;

	@Field((type) => Int, { description: "The type of category this post belongs to" })
	category_id: number;

	@Field()
	created_at: Date;

	@Field({ nullable: true })
	updated_at?: Date;
}
