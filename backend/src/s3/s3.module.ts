import { Module } from "@nestjs/common";
import { S3Service } from "./s3.service";
import { S3Resolver } from "./s3.resolver";
import { ConfigService } from "@nestjs/config";
import { S3Client } from "@aws-sdk/client-s3";

@Module({
	providers: [
		S3Resolver,
		S3Service,
		{
			provide: "S3_CLIENT",
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				return new S3Client({
					credentials: {
						accessKeyId: configService.get("AWS_ACCESS_KEY_ID"),
						secretAccessKey: configService.get("AWS_SECRET_ACCESS_KEY")
					},
					forcePathStyle: true,
					endpoint: configService.get("AWS_S3_ENDPOINT"),
					region: configService.get("AWS_REGION")
				});
			}
		}
	]
})
export class S3Module {}
