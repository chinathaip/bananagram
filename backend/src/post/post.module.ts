import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostResolver } from "./post.resolver";
import { DatabaseModule } from "../db/db.module";
import { CategoryModule } from "../category/category.module";
import { UserModule } from "../user/user.module";
import { PostConnectionResolver } from "./post-connection.resolver";
import { MediaModule } from "../media/media.module";

@Module({
	imports: [DatabaseModule, CategoryModule, UserModule, MediaModule],
	providers: [PostResolver, PostConnectionResolver, PostService]
})
export class PostModule {}
