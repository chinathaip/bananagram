import { BasicStrategy as Strategy } from "passport-http";
import { PassportStrategy } from "@nestjs/passport";
import { UnauthorizedException } from "@nestjs/common";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BasicAuthStrategy extends PassportStrategy(Strategy) {
	validate = async (username: string, password: string): Promise<Boolean> => {
		if (username === "khing" && password === "hehe") return true;

		throw new UnauthorizedException();
	};
}
