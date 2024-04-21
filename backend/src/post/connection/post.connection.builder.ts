import { OffsetPaginatedConnectionBuilder, PageInfo } from "nestjs-graphql-connection";
import { PostConnection } from "./post.connection";
import { PostConnectionArgs } from "../dto/post-args.input";
import { PostEdge } from "./post.edge";
import { Post } from "../entities/post.entity";

export class PostConnectionBuilder extends OffsetPaginatedConnectionBuilder<
	PostConnection,
	PostConnectionArgs,
	PostEdge,
	Post
> {
	public createConnection(fields: { edges: PostEdge[]; pageInfo: PageInfo }): PostConnection {
		return new PostConnection(fields);
	}

	public createEdge(fields: { node: Post; cursor: string }): PostEdge {
		return new PostEdge(fields);
	}
}
