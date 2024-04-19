import { Inject, Injectable, Logger } from "@nestjs/common";
import { Client, QueryConfig } from "pg";
import { TransactionResult } from "./db.model";

@Injectable()
export class DatabaseService {
	constructor(@Inject("DB_CONN") private connection: Client) {}

	private readonly logger = new Logger(DatabaseService.name);

	async query<T>(sql: string): Promise<T> {
		try {
			const res = await this.connection.query(sql);
			this.logger.log(`command: ${sql} affected: ${res.rowCount} rows`);
			return res.rows as T;
		} catch (e) {
			this.logger.error(`error while querying: ${e}`);
		}
	}

	async transaction(queries: QueryConfig[]): Promise<TransactionResult[]> {
		const transactionResult: TransactionResult[] = [];
		try {
			await this.connection.query("BEGIN");
			await Promise.all(
				queries.map(async (query) => {
					try {
						const res = await this.connection.query(query);
						transactionResult.push({ name: query.name, rowsAffected: res.rowCount, rows: res.rows });
						this.logger.log(`transaction: ${query.name}, rows affected: ${res.rowCount}`);
					} catch (e) {
						await this.connection.query("ROLLBACK");
						throw e;
					}
				})
			);
			await this.connection.query("COMMIT");
			return transactionResult;
		} catch (e) {
			throw e;
		}
	}
}
