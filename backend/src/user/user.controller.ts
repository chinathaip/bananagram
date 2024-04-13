import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ClerkUserEventType, ClerkUserWebhook } from "./dto/clerk-webhook.dto";

@Controller("users")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	handle(@Body() clerkUserWebhook: ClerkUserWebhook) {
		switch (clerkUserWebhook.type) {
			case ClerkUserEventType.Created:
				const createUserDto: CreateUserDto = {
					id: clerkUserWebhook.data.id,
					username: clerkUserWebhook.data.username,
					email: clerkUserWebhook.data.email_addresses[0].email_address,
					bio: clerkUserWebhook.data.public_metadata.bio,
					display_name: clerkUserWebhook.data.public_metadata.display_name,
					profile_picture: clerkUserWebhook.data.profile_image_url
				};
				return this.userService.create(createUserDto);

			case ClerkUserEventType.Updated:
				console.log("updates!!!");

			case ClerkUserEventType.Deleted:
				return this.userService.remove(clerkUserWebhook.data.id);

			default:
				throw new HttpException(
					{
						status: HttpStatus.BAD_REQUEST,
						error: "unknown user event"
					},
					HttpStatus.BAD_REQUEST
				);
		}
	}

	@Get()
	findAll() {
		return this.userService.findAll();
	}

	@Patch(":id")
	update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(+id, updateUserDto);
	}
}
