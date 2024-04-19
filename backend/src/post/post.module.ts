import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostResolver } from "./post.resolver";
import { DatabaseModule } from "../db/db.module";

@Module({
	imports: [DatabaseModule],
	providers: [PostResolver, PostService]
})
export class PostModule {}
