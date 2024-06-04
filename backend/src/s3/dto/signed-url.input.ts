import { InputType, Field, Int } from "@nestjs/graphql";

@InputType()
export class SignedUrlInput {
	@Field()
	fileKey: string;

	@Field()
	contentType: string;

	@Field(() => Int)
	contentSize: number;
}
