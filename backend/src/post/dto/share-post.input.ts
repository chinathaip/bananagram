import { InputType, Field, Int } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class SharePostInput {
	@IsNotEmpty()
	@Field(() => Int)
	postId: number;

	@Field({ nullable: true })
	content?: string;
}
