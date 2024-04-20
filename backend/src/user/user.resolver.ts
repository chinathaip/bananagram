import { Resolver } from "@nestjs/graphql";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";

@Resolver((of) => User)
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	// TODO: query for getting user information?
}
