import { Module } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommentGateway } from "./comment.gateway";
import { DatabaseModule } from "../db/db.module";
import { CommentResolver } from './comment.resolver';

@Module({
	imports: [DatabaseModule],
	providers: [CommentGateway, CommentService, CommentResolver]
})
export class CommentModule {}
