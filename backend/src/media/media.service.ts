import { Injectable } from "@nestjs/common";
import { CreateMediaInput } from "./dto/create-media.input";
import { UpdateMediaInput } from "./dto/update-media.input";
import { Media } from "./entities/media.entity";
import { DatabaseService } from "../db/db.service";

@Injectable()
export class MediaService {
	constructor(private readonly db: DatabaseService) {}

	create(createMediaInput: CreateMediaInput) {
		return "This action adds a new media";
	}

	async findAllFor(postId: number): Promise<Media[]> {
		const medias = await this.db.query<Media[]>(`SELECT * FROM public.media WHERE post_id = ${postId}`);

		return medias;
	}

	update(id: number, updateMediaInput: UpdateMediaInput) {
		return `This action updates a #${id} media`;
	}

	remove(id: number) {
		return `This action removes a #${id} media`;
	}
}
