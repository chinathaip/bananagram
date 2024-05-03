import { InputType, Int, Field } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreatePostInput {
	// TODO: maybe specify max length
	@IsNotEmpty()
	@Field()
	content: string;

	@Field()
	category_name: string;
}
