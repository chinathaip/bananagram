import { InputType, Int, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber } from "class-validator";

@InputType()
export class CreatePostInput {
	// TODO: maybe specify max length
	@IsNotEmpty()
	@Field()
	content: string;

	@IsNotEmpty()
	@Field()
	user_id: string;

	@IsNumber()
	@Field((type) => Int)
	category_id: number;
}
