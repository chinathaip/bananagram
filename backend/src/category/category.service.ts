import { Injectable, Logger } from "@nestjs/common";
import { DatabaseService } from "../db/db.service";
import { Category } from "./entities/category.entity";
import { NotFoundError } from "../common/errors/not-found.error";

@Injectable()
export class CategoryService {
	constructor(private readonly db: DatabaseService) {}

	private readonly logger = new Logger(CategoryService.name);

	async findOne(name: string): Promise<Category> {
		const category = await this.db.query<Category[]>(`SELECT * FROM public.category WHERE name = '${name}' LIMIT 1`);

		if (category.length === 0) {
			throw new NotFoundError(`Category name ${name} not found`);
		}

		return category[0];
	}

	async findAll(): Promise<Category[]> {
		const categories = await this.db.query<Category[]>(`SELECT * FROM public.category`);
		return categories;
	}
}
