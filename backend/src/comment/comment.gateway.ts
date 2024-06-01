import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, WsException } from "@nestjs/websockets";
import { CommentService } from "./comment.service";
import { CreateCommentInput } from "./dto/create-comment.input";
import { Server } from "http";
import { CurrentWebSocketUesr } from "../auth/decorators/current-user.decorator";
import { Logger, UseGuards } from "@nestjs/common";
import { JwtWSAuthGuard } from "../auth/auth-jwt.guard";
import { EditCommentInput } from "./dto/edit-comment.input";

@WebSocketGateway({ cors: { origin: "*" } })
export class CommentGateway {
	constructor(private readonly commentService: CommentService) {}

	private readonly logger = new Logger(CommentGateway.name);

	@WebSocketServer()
	server: Server;

	@UseGuards(JwtWSAuthGuard)
	@SubscribeMessage("createComment")
	async create(
		@CurrentWebSocketUesr() userId: string,
		@MessageBody() createCommentDto: CreateCommentInput
	): Promise<void> {
		try {
			const comment = await this.commentService.create(userId, createCommentDto);
			this.server.emit("createComment", comment);
		} catch (error) {
			this.logger.error(error);
			throw new WsException("Could not create new comment");
		}
	}

	@UseGuards(JwtWSAuthGuard)
	@SubscribeMessage("editComment")
	async edit(
		@CurrentWebSocketUesr() userId: string,
		@MessageBody() editCommentInput: EditCommentInput
	): Promise<void> {
		try {
			const editedComment = await this.commentService.update(userId, editCommentInput);
			this.server.emit("editComment", editedComment);
		} catch (error) {
			this.logger.error(error);
			throw new WsException("Could not edit comment");
		}
	}

	@UseGuards(JwtWSAuthGuard)
	@SubscribeMessage("deleteComment")
	async delete(@CurrentWebSocketUesr() userId: string, @MessageBody() commentId: number) {
		try {
			await this.commentService.remove(userId, commentId);
			this.server.emit("deleteComment", "ok!");
		} catch (error) {
			this.logger.error(error);
			throw new WsException("Could not delete comment");
		}
	}
}
