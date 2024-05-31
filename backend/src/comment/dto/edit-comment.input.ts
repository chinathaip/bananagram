import { CreateCommentInput } from "./create-comment.input";
import { InputType, Field, Int, PartialType } from "@nestjs/graphql";

@InputType()
export class EditCommentInput extends PartialType(CreateCommentInput) {
	@Field(() => Int)
	id: number;
}
