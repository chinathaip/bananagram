import { Query, Resolver, Args, ResolveField, Parent } from "@nestjs/graphql";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuardOptional } from "src/auth/auth-jwt.guard";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";

@Resolver((of) => User)
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@UseGuards(JwtAuthGuardOptional)
	@Query(() => User)
	user(@Args("id") id: string) {
		return this.userService.findOne(id);
	}

	@ResolveField(() => Boolean)
	is_owner(@CurrentUser() userId: string, @Parent() user: User) {
		return userId === user.id;
	}
}
