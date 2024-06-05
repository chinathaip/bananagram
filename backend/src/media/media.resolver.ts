import { Resolver, Mutation, Args, Int } from "@nestjs/graphql";
import { MediaService } from "./media.service";
import { Media } from "./entities/media.entity";

@Resolver(() => Media)
export class MediaResolver {
	constructor(private readonly mediaService: MediaService) {}

	@Mutation(() => Media)
	removeMedia(@Args("id", { type: () => Int }) id: number) {
		return this.mediaService.remove(id);
	}
}
