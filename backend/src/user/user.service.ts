import { Injectable, Logger, InternalServerErrorException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { DatabaseService } from "../db/db.service";
import { User } from "./entities/user.entity";
import { QueryConfig } from "pg";
import { NotFoundError } from "../common/errors/not-found.error";
import { UserFollow } from "./entities/user-follow.entity";
import { BadRequestError } from "../common/errors/bad-request.error";
import { GraphQLError } from "graphql";

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
			throw new NotFoundError(`User ${id} not found`);
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

	async alreadyFollowed(userId: string, friendId: string): Promise<boolean> {
		const userFollow = await this.db.query<UserFollow[]>(
			`SELECT * FROM public.user_follow WHERE user_id = '${userId}' AND friend_id = '${friendId}' LIMIT 1`
		);
		return userFollow.length > 0;
	}

	async follow(userId: string, friendId: string): Promise<User> {
		try {
			if (!(await this.findOne(friendId))) {
				throw new NotFoundError(`Friend ${friendId} does not exist`);
			}
			if (await this.alreadyFollowed(userId, friendId)) {
				throw new BadRequestError(`${userId} is already following ${friendId}`);
			}

			const queries: QueryConfig[] = [
				{
					name: `User ${userId} follows ${friendId}`,
					text: `INSERT INTO public.user_follow (user_id, friend_id) VALUES ($1, $2)`,
					values: [userId, friendId]
				}
			];
			await this.db.transaction(queries);

			return this.findOne(friendId); // return the updated status for the person being followed
		} catch (e) {
			if (e instanceof GraphQLError) {
				throw e;
			}

			this.logger.error(`error when following: ${e}`);
			throw new InternalServerErrorException();
		}
		return;
	}
}
