import { CategoryService } from "./category.service";
import { Category } from "./entities/category.entity";
import { Resolver } from "@nestjs/graphql";

@Resolver((of) => Category)
export class CategoryResolver {
	constructor(private readonly categoryService: CategoryService) {}

	// TODO: findAll endpoint for frontend to see all available categories
}
