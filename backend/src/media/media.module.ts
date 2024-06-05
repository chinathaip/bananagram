import { Module } from "@nestjs/common";
import { MediaService } from "./media.service";
import { MediaResolver } from "./media.resolver";
import { DatabaseModule } from "../db/db.module";

@Module({
	imports: [DatabaseModule],
	providers: [MediaResolver, MediaService],
	exports: [MediaService]
})
export class MediaModule {}
