import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class Post {
	@Field((type) => Int)
	id: number;

	@Field()
	content: string;

	@Field({ description: "The user who created this post" })
	userId: string;

	@Field((type) => Int, { description: "The type of category this post belongs to" })
	categoryId: number;

	@Field()
	createdAt: Date;

	@Field({ nullable: true })
	updatedAt?: Date;
}
