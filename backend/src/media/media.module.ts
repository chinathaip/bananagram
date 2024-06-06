import { Module } from "@nestjs/common";
import { MediaService } from "./media.service";
import { MediaResolver } from "./media.resolver";
import { DatabaseModule } from "../db/db.module";
import { S3Module } from "../s3/s3.module";

@Module({
	imports: [DatabaseModule, S3Module],
	providers: [MediaResolver, MediaService],
	exports: [MediaService]
})
export class MediaModule {}
