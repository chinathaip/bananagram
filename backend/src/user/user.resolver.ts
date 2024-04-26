import { Query, Resolver, Args, ResolveField, Parent, Mutation, Int } from "@nestjs/graphql";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard, JwtAuthGuardOptional } from "../auth/auth-jwt.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { PaginationService } from "../common/pagination/pagination.service";

@Resolver((of) => User)
export class UserResolver {
	constructor(
		private readonly userService: UserService,
		private readonly paginationService: PaginationService
	) {}

	@UseGuards(JwtAuthGuardOptional)
	@Query(() => User)
	user(@Args("id") id: string) {
		return this.userService.findOne(id);
	}

	@ResolveField(() => Boolean)
	is_owner(@CurrentUser() userId: string, @Parent() user: User) {
		return userId === user.id;
	}

	@ResolveField(() => Int)
	following(@Parent() user: User) {
		return this.paginationService.getItemCountFor("user_follow", [{ where: "user_id", equals: user.id }]);
	}

	@ResolveField(() => Int)
	followers(@Parent() user: User) {
		// friend_id = the person being followed. Count the occurance that the user is referenced as friend_id
		return this.paginationService.getItemCountFor("user_follow", [{ where: "friend_id", equals: user.id }]);
	}

	@UseGuards(JwtAuthGuard)
	@Mutation(() => User)
	follow(@CurrentUser() userId: string, @Args("id") friendId: string) {
		return this.userService.follow(userId, friendId);
	}
}
