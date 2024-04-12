import { Inject, Injectable } from "@nestjs/common";
import { Client } from "pg";

@Injectable()
export class DatabaseService {
	constructor(@Inject("DB_CONN") private connection: Client) {}

	async query<T>(sql: string): Promise<T> {
		return (await this.connection.query(sql)).rows as T;
	}
}
