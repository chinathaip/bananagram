import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { DatabaseService } from "../db/db.service";

interface Course {
	id: number;
	code: string;
	full_name: string;
	prerequisites: string[];
}

@Injectable()
export class UserService {
	constructor(private readonly db: DatabaseService) {}

	create(createUserDto: CreateUserDto) {
		return "This action adds a new user";
	}

	async findAll() {
		const result = await this.db.query<Course[]>(`SELECT * FROM public."Course"`);
		return `This action returns all user`;
	}

	update(id: number, updateUserDto: UpdateUserDto) {
		return `This action updates a #${id} user`;
	}

	remove(id: number) {
		return `This action removes a #${id} user`;
	}
}
