import { Module } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommentGateway } from "./comment.gateway";
import { DatabaseModule } from "../db/db.module";

@Module({
	imports: [DatabaseModule],
	providers: [CommentGateway, CommentService]
})
export class CommentModule {}
