import { Resolver, Mutation, Args, Int } from "@nestjs/graphql";
import { MediaService } from "./media.service";
import { Media } from "./entities/media.entity";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth-jwt.guard";

@Resolver(() => Media)
export class MediaResolver {
	constructor(private readonly mediaService: MediaService) {}

	@UseGuards(JwtAuthGuard)
	@Mutation(() => Media)
	removeMedia(@Args("id") id: string) {
		return this.mediaService.remove(id);
	}
}
