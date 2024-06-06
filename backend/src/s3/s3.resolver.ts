import { Resolver, Args, Mutation } from "@nestjs/graphql";
import { S3Service } from "./s3.service";
import { SignedUrl } from "./entities/s3.entity";
import { SignedUrlInput } from "./dto/signed-url.input";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth-jwt.guard";

@Resolver(() => SignedUrl)
export class S3Resolver {
	constructor(private readonly s3Service: S3Service) {}

	@UseGuards(JwtAuthGuard)
	@Mutation(() => SignedUrl)
	signedUrl(@Args("signedUrlInput") signedUrlInput: SignedUrlInput) {
		return this.s3Service.getSignedUrl(signedUrlInput);
	}
}
