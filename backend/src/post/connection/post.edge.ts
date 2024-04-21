import { createEdgeType } from "nestjs-graphql-connection";
import { Post } from "../entities/post.entity";
import { ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PostEdge extends createEdgeType(Post) {}
