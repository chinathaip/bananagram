import { CreatePostInput } from "./create-post.input";
import { InputType, Field, Int, PartialType } from "@nestjs/graphql";

@InputType()
export class EditPostInput extends PartialType(CreatePostInput) {
	@Field(() => Int)
	id: number;

	@Field({ nullable: true })
	updated_at?: Date;
}
