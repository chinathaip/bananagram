import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreateCommentInput {
	@Field()
	postId: string;

	@IsNotEmpty()
	@Field()
	content: string;
}
