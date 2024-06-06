import { InputType, Field, Int } from "@nestjs/graphql";

@InputType()
export class SignedUrlInput {
	@Field()
	action: string;

	@Field()
	fileKey: string;

	@Field({ nullable: true })
	contentType?: string;

	@Field(() => Int, { nullable: true })
	contentSize?: number;
}
