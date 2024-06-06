import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class Media {
	@Field()
	id: string;

	@Field()
	url: string;

	@Field(() => Int)
	post_id: number;
}
