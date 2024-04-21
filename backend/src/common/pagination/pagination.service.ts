import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../../db/db.service";
import { WhereEqualCondition, appendQueryCondition } from "../util/query-condition";

@Injectable()
export class PaginationService {
	constructor(private readonly db: DatabaseService) {}

	async getItemCountFor(entity: string, conditions?: WhereEqualCondition[]): Promise<number> {
		const statement = appendQueryCondition(`SELECT COUNT(*) FROM public.${entity}`, conditions);
		const result = await this.db.query<{ count: number }[]>(statement);
		return result[0].count;
	}
}
