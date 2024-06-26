import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "./dto/auth.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true, // TODO: DONT FORGET TO PUT THIS BACK TO 'FALSE'
			secretOrKey: configService.get("JWT_SECRET")
		});
	}

	async validate(payload: any): Promise<JwtPayload> {
		return { id: payload.sub, email: payload.email };
	}
}
