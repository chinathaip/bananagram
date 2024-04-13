import { Logger, Module, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { Client } from "pg";
import { DatabaseService } from "./db.service";
import { ModuleRef } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";

const dbFactory = async (configService: ConfigService) => {
	return new Client({
		host: configService.get("POSTGRES_HOST"),
		port: configService.get("POSTGRES_PORT"),
		user: configService.get("POSTGRES_USER"),
		password: configService.get("POSTGRES_PASSWORD"),
		database: configService.get("POSTGRES_DATABASE")
	});
};

@Module({
	providers: [
		{
			provide: "DB_CONN",
			inject: [ConfigService],
			useFactory: dbFactory
		},
		DatabaseService
	],
	exports: [DatabaseService]
})
export class DatabaseModule implements OnApplicationBootstrap, OnApplicationShutdown {
	constructor(private readonly moduleRef: ModuleRef) {}

	private readonly logger = new Logger(DatabaseModule.name);

	async onApplicationBootstrap() {
		await this.moduleRef.get("DB_CONN").connect();
		this.logger.log("create connection to postgres");
	}

	async onApplicationShutdown(signal?: string) {
		await this.moduleRef.get("DB_CONN").close();
		this.logger.log(`close connection to postgres on signal ${signal}`);
	}
}
