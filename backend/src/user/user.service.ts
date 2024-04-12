import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { DatabaseService } from "../db/db.service";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
	constructor(private readonly db: DatabaseService) {}

	create(createUserDto: CreateUserDto) {
		return "This action adds a new user";
	}

	async findAll(): Promise<User[]> {
		return await this.db.query<User[]>(`SELECT * FROM public.user`);
	}

	update(id: number, updateUserDto: UpdateUserDto) {
		return `This action updates a #${id} user`;
	}

	remove(id: number) {
		return `This action removes a #${id} user`;
	}
}
