import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostResolver } from "./post.resolver";
import { DatabaseModule } from "../db/db.module";
import { CategoryModule } from "../category/category.module";

@Module({
	imports: [DatabaseModule, CategoryModule],
	providers: [PostResolver, PostService]
})
export class PostModule {}
