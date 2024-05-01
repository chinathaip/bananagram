import { ArgsType, Field } from "@nestjs/graphql";
import { ConnectionArgs } from "nestjs-graphql-connection";

@ArgsType()
export class PostConnectionArgs extends ConnectionArgs {
	// search by category
	@Field({ nullable: true })
	category_name?: string;

	// search by user
	@Field({ nullable: true })
	user_id?: string;

	// TODO: search by hashtags
}
