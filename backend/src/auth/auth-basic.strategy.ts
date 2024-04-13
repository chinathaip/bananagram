import { BasicStrategy as Strategy } from "passport-http";
import { PassportStrategy } from "@nestjs/passport";
import { UnauthorizedException } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class BasicAuthStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly configService: ConfigService) {
		super();
	}

	validate = async (username: string, password: string): Promise<Boolean> => {
		if (
			username === this.configService.get<string>("BASIC_AUTH_USERNAME") &&
			password === this.configService.get<string>("BASIC_AUTH_PASSWORD")
		) {
			return true;
		}

		throw new UnauthorizedException();
	};
}
