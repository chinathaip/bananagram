import { InputType, Field, Int } from "@nestjs/graphql";

@InputType()
export class SignedUrlInput {
	@Field()
	fileKey: string;

	@Field({ nullable: true })
	contentType?: string;

	@Field(() => Int, { nullable: true })
	contentSize?: number;
}
