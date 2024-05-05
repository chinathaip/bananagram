import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { BasicAuthStrategy } from "./auth-basic.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./auth-jwt.strategy";
import { AnonymousStrategy } from "./auth-anonymous.strategy";
import { JwtWebSocketStrategy } from "./auth-ws.strategy";

const jwtFactory = async (configService: ConfigService) => ({
	secretOrPrivateKey: configService.get("JWT_SECRET")
});

@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			useFactory: jwtFactory,
			inject: [ConfigService]
		})
	],
	providers: [BasicAuthStrategy, JwtStrategy, AnonymousStrategy, JwtWebSocketStrategy]
})
export class AuthModule {}
