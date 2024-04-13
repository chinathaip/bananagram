import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		if (!createUserDto.id || !createUserDto.username || !createUserDto.email) {
			throw new HttpException(
				{
					status: HttpStatus.BAD_REQUEST,
					error: "missing fields to create new user"
				},
				HttpStatus.BAD_REQUEST
			);
		}
		return this.userService.create(createUserDto);
	}

	@Get()
	findAll() {
		return this.userService.findAll();
	}

	@Patch(":id")
	update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(+id, updateUserDto);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.userService.remove(+id);
	}
}
