import { Module } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommentGateway } from "./comment.gateway";
import { DatabaseModule } from "../db/db.module";
import { CommentResolver } from "./comment.resolver";
import { UserModule } from "../user/user.module";

@Module({
	imports: [DatabaseModule, UserModule],
	providers: [CommentGateway, CommentService, CommentResolver]
})
export class CommentModule {}
