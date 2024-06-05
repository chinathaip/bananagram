import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class Media {
	@Field(() => Int)
	id: number;

	@Field()
	url: string;

	@Field(() => Int)
	post_id: number;
}
