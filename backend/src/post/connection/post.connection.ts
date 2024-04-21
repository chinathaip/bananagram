import { createConnectionType } from "nestjs-graphql-connection";
import { PostEdge } from "./post.edge";
import { ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PostConnection extends createConnectionType(PostEdge) {}
