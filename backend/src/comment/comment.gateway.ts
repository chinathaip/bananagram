import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from "@nestjs/websockets";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Server } from "http";
import { CurrentWebSocketUesr } from "../auth/decorators/current-user.decorator";
import { UseGuards } from "@nestjs/common";
import { JwtWSAuthGuard } from "src/auth/auth-jwt.guard";

@WebSocketGateway(3002, { cors: { origin: "*" } })
export class CommentGateway {
	constructor(private readonly commentService: CommentService) {}

	@WebSocketServer()
	server: Server;

	@UseGuards(JwtWSAuthGuard)
	@SubscribeMessage("createComment")
	create(@CurrentWebSocketUesr() userId: string, @MessageBody() createCommentDto: CreateCommentDto): void {
		this.commentService
			.create(userId, createCommentDto)
			.then((comment) => {
				this.server.emit("createComment", comment);
			})
			.catch((error) => {
				this.server.emit("createComment", error);
			});
	}

	@SubscribeMessage("findAllComment")
	findAll() {
		return this.commentService.findAll();
	}

	@SubscribeMessage("findOneComment")
	findOne(@MessageBody() id: number) {
		return this.commentService.findOne(id);
	}

	@SubscribeMessage("updateComment")
	update(@MessageBody() updateCommentDto: UpdateCommentDto) {
		return this.commentService.update(updateCommentDto.id, updateCommentDto);
	}

	@SubscribeMessage("removeComment")
	remove(@MessageBody() id: number) {
		return this.commentService.remove(id);
	}
}
