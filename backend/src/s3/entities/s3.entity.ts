import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class SignedUrl {
	@Field()
	url: string;

	@Field(() => Int)
	mediaId: number;
}
