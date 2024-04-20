import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class User {
	@Field()
	id: string;

	@Field()
	username: string;

	@Field()
	email: string;

	@Field()
	bio: string;

	@Field()
	display_name: string;

	@Field()
	profile_picture: string;

	@Field()
	created_at: Date;
}
