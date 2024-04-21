import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostResolver } from "./post.resolver";
import { DatabaseModule } from "../db/db.module";
import { CategoryModule } from "../category/category.module";
import { UserModule } from "../user/user.module";
import { PostConnectionResolver } from "./post-connection.resolver";

@Module({
	imports: [DatabaseModule, CategoryModule, UserModule],
	providers: [PostResolver, PostConnectionResolver, PostService]
})
export class PostModule {}
