import { Logger, Module, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { Client } from "pg";
import { DatabaseService } from "./db.service";
import { ModuleRef } from "@nestjs/core";

const dbFactory = async () => {
	return new Client({
		host: "localhost",
		port: 9999,
		user: "ite442",
		password: "yaylastterm",
		database: "bananagram-dev"
	});
};

@Module({
	providers: [
		{
			provide: "DB_CONN",
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
