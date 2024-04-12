import { Inject, Injectable } from "@nestjs/common";
import { Connection, QueryResult } from "postgresql-client";

@Injectable()
export class DatabaseService {
	constructor(@Inject("DB_CONN") private connection: Connection) {}

	async query(sql: string): Promise<QueryResult> {
		return this.connection.query(sql);
	}
}
