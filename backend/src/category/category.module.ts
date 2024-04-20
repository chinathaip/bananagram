import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryResolver } from "./category.resolver";
import { DatabaseModule } from "../db/db.module";

@Module({
	imports: [DatabaseModule],
	providers: [CategoryResolver, CategoryService],
	exports: [CategoryService]
})
export class CategoryModule {}
