import { ArgsType, Field, Int } from "@nestjs/graphql";
import { ConnectionArgs } from "nestjs-graphql-connection";

@ArgsType()
export class PostConnectionArgs extends ConnectionArgs {
	// search by category
	@Field(() => Int, { nullable: true })
	category_id?: number;

	// search by user
	@Field({ nullable: true })
	user_id?: string;

	// TODO: search by hashtags
}
