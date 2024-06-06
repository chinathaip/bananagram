import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DeleteBucketCommand, DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import { SignedUrlInput } from "./dto/signed-url.input";
import { GraphQLError } from "graphql";
import { BadRequestError } from "../common/errors/bad-request.error";
import { SignedUrl } from "./entities/s3.entity";

const MAX_MEDIA_SIZE = 1024 * 1024 * 10;
const ACCEPTED_CONTENT_TYPE = ["image/png", "image/jpeg", "image/jpg", "image/gif"];

@Injectable()
export class S3Service {
	constructor(
		private readonly configService: ConfigService,
		@Inject("S3_CLIENT") private readonly s3Client: S3Client
	) {}

	private readonly logger = new Logger(S3Service.name);

	async getSignedUrl(userId: string, signedUrlInput: SignedUrlInput): Promise<SignedUrl> {
		try {
			if (!signedUrlInput.fileKey) {
				throw new BadRequestError("File Key is missing");
			}

			const action = signedUrlInput.action;
			if (action !== "PUT" && action !== "DELETE") {
				throw new BadRequestError("Unsupported action");
			}

			if (action === "PUT" && signedUrlInput.contentSize > MAX_MEDIA_SIZE) {
				throw new BadRequestError("Media is too big");
			}

			if (action === "PUT" && !ACCEPTED_CONTENT_TYPE.includes(signedUrlInput.contentType)) {
				throw new BadRequestError("Unsupported media type");
			}

			const bucket = this.configService.get("AWS_BUCKET_NAME");
			const url = await getSignedUrl(
				this.s3Client,
				action === "PUT"
					? new PutObjectCommand({
							Bucket: bucket,
							Key: signedUrlInput.fileKey,
							ContentType: signedUrlInput.contentType,
							ContentLength: signedUrlInput.contentSize
						})
					: new DeleteObjectCommand({
							Bucket: bucket,
							Key: signedUrlInput.fileKey
						}),
				{ expiresIn: 60 }
			);

			const mediaId = 0;

			return { url, mediaId };
		} catch (e) {
			if (e instanceof GraphQLError) {
				throw e;
			}

			this.logger.error(`cannot get signed url: ${e}`);
			throw new InternalServerErrorException();
		}
	}
}
