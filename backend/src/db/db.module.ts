import { Module, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { Client } from "pg";
import { DatabaseService } from "./db.service";
import { ModuleRef } from "@nestjs/core";

const dbFactory = async () => {
	return new Client({
		host: "localhost",
		port: 5432,
		user: "syntax",
		password: "stamford",
		database: "coursecompose-dev"
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

	async onApplicationBootstrap() {
		await this.moduleRef.get("DB_CONN").connect();
		console.log("creating connection to postgres");
	}

	async onApplicationShutdown(signal?: string) {
		await this.moduleRef.get("DB_CONN").close();
		console.log(`closing connection to postgres on signal ${signal}`);
	}
}
