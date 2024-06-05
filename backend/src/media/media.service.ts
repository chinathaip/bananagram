import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { Media } from "./entities/media.entity";
import { DatabaseService } from "../db/db.service";
import { QueryConfig } from "pg";
import { ConfigService } from "@nestjs/config";
import { GraphQLError } from "graphql";

@Injectable()
export class MediaService {
	constructor(
		private readonly db: DatabaseService,
		private readonly configService: ConfigService
	) {}

	private readonly logger = new Logger(MediaService.name);

	async create(postId: number, userId: string, fileKey: string): Promise<Media> {
		try {
			const queries: QueryConfig[] = [
				{
					name: `Save media for post ${postId}`,
					text: `INSERT INTO public.media (url, post_id) VALUES ($1, $2) RETURNING *`,
					values: [`${this.configService.getOrThrow("AWS_S3_ENDPOINT")}/bananagram/${fileKey}`, postId]
				}
			];

			const results = await this.db.transaction(queries);
			const media = results[0].rows as Media[];

			return media[0];
		} catch (e) {
			if (e instanceof GraphQLError) {
				throw e;
			}

			this.logger.error(`error when saving media for post ${postId}: ${e}`);
			throw new InternalServerErrorException();
		}
	}

	async findAllFor(postId: number): Promise<Media[]> {
		const medias = await this.db.query<Media[]>(`SELECT * FROM public.media WHERE post_id = ${postId}`);

		return medias;
	}

	remove(id: number) {
		return `This action removes a #${id} media`;
	}
}
