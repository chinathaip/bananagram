import { Query } from "@nestjs/graphql";
import { CategoryService } from "./category.service";
import { Category } from "./entities/category.entity";
import { Resolver } from "@nestjs/graphql";

@Resolver((of) => Category)
export class CategoryResolver {
	constructor(private readonly categoryService: CategoryService) {}

	@Query(() => [Category])
	categories() {
		return this.categoryService.findAll();
	}
}
