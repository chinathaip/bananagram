import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { DatabaseModule } from "../db/db.module";
import { UserResolver } from "./user.resolver";

@Module({
	imports: [DatabaseModule],
	controllers: [UserController],
	providers: [UserService, UserResolver],
	exports: [UserService]
})
export class UserModule {}
