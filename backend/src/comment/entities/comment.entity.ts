import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Comment {
	@Field((type) => Int)
	id: number;

	@Field()
	content: string;

	@Field((type) => Int)
	post_id: number;

	@Field()
	user_id: string;

	@Field()
	created_at: Date;

	@Field({ nullable: true })
	updated_at?: Date;
}
