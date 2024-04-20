import { Injectable, Logger } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { DatabaseService } from "../db/db.service";
import { User } from "./entities/user.entity";
import { QueryConfig } from "pg";
import { NotFoundError } from "../common/errors/not-found.error";

@Injectable()
export class UserService {
	constructor(private readonly db: DatabaseService) {}

	private readonly logger = new Logger(UserService.name);

	async create(createUserDto: CreateUserDto | UpdateUserDto) {
		try {
			const queries: QueryConfig[] = [
				{
					name: `Create New User: ${createUserDto.id}`,
					text: "INSERT INTO public.user (id, username, email, bio, display_name, profile_picture) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
					values: [
						createUserDto.id,
						createUserDto.username,
						createUserDto.email,
						createUserDto.bio,
						createUserDto.display_name,
						createUserDto.profile_picture
					]
				}
			];
			return await this.db.transaction(queries);
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}

	async findAll(): Promise<User[]> {
		return await this.db.query<User[]>(`SELECT * FROM public.user`);
	}

	async findOne(id: string): Promise<User> {
		const user = await this.db.query<User[]>(`SELECT * FROM public.user WHERE id = '${id}' LIMIT 1`);

		if (user.length === 0) {
			throw new NotFoundError("User not found");
		}

		return user[0];
	}

	async update(updateUserDto: UpdateUserDto) {
		try {
			const queries: QueryConfig[] = [
				{
					name: `Update User Information for ${updateUserDto.id}`,
					text: "UPDATE public.user SET username=$2, email=$3, bio=$4, display_name=$5, profile_picture=$6, updated_at=$7 WHERE id = $1",
					values: [
						updateUserDto.id,
						updateUserDto.username,
						updateUserDto.email,
						updateUserDto.bio,
						updateUserDto.display_name,
						updateUserDto.profile_picture,
						updateUserDto.updated_at
					]
				}
			];
			const results = await this.db.transaction(queries);
			// if user is not found, create one
			if (results[0].rowsAffected === 0) {
				this.logger.warn(`user: ${updateUserDto.id} does not exist for update, creating a new entry`);
				return await this.create(updateUserDto);
			}
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}

	async remove(id: string) {
		try {
			const queries: QueryConfig[] = [
				{
					name: `Delete User Information for ${id}`,
					text: `DELETE FROM public.user WHERE id = '${id}' RETURNING *`
				}
			];
			const results = await this.db.transaction(queries);
			if (results[0].rowsAffected === 0) {
				this.logger.warn(`user: ${id} does not exist for delete`);
			}
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
}
