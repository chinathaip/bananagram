import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { DatabaseService } from "../db/db.service";
import { User } from "./entities/user.entity";
import { QueryConfig } from "pg";

@Injectable()
export class UserService {
	constructor(private readonly db: DatabaseService) {}

	async create(createUserDto: CreateUserDto) {
		const queries: QueryConfig[] = [
			{
				name: "Create New User",
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
		const results = await this.db.transaction(queries);
		return results;
	}

	async findAll(): Promise<User[]> {
		return await this.db.query<User[]>(`SELECT * FROM public.user`);
	}

	update(id: number, updateUserDto: UpdateUserDto) {
		return `This action updates a #${id} user`;
	}

	async remove(id: string) {
		return await this.db.query<User>(`DELETE FROM public.user WHERE id = '${id}' RETURNING *`);
	}
}
