import { Inject, Injectable, Logger } from "@nestjs/common";
import { Client, QueryConfig } from "pg";
import { TransactionResult } from "./db.model";

@Injectable()
export class DatabaseService {
	constructor(@Inject("DB_CONN") private connection: Client) {}

	private readonly logger = new Logger(DatabaseService.name);

	async query<T>(sql: string): Promise<T> {
		const res = await this.connection.query(sql);
		this.logger.log(`comand: ${sql} affected: ${res.rowCount} rows`);
		return res.rows as T;
	}

	async transaction(queries: QueryConfig[]): Promise<TransactionResult[]> {
		try {
			const transactionResult: TransactionResult[] = [];
			await this.connection.query("BEGIN");
			queries.forEach(async (query) => {
				const res = await this.connection.query(query);
				transactionResult.push({ name: query.name, rowsAffected: res.rowCount, rows: res.rows });
				this.logger.log(`transaction: ${query.name}, rows affected: ${res.rowCount}, command: ${query.text}`);
			});
			await this.connection.query("COMMIT");
			return transactionResult;
		} catch (e) {
			await this.connection.query("ROLLBACK");
			throw e;
		}
	}
}
