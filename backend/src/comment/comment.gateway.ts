import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, WsException } from "@nestjs/websockets";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { Server } from "http";
import { CurrentWebSocketUesr } from "../auth/decorators/current-user.decorator";
import { UseGuards } from "@nestjs/common";
import { JwtWSAuthGuard } from "src/auth/auth-jwt.guard";

@WebSocketGateway({ cors: { origin: "*" } })
export class CommentGateway {
	constructor(private readonly commentService: CommentService) {}

	@WebSocketServer()
	server: Server;

	@UseGuards(JwtWSAuthGuard)
	@SubscribeMessage("createComment")
	async create(
		@CurrentWebSocketUesr() userId: string,
		@MessageBody() createCommentDto: CreateCommentDto
	): Promise<void> {
		try {
			const comment = await this.commentService.create(userId, createCommentDto);
			this.server.emit("createComment", comment);
		} catch (error) {
			console.log(error);
			throw new WsException("Could not create new comment");
		}
	}
}
