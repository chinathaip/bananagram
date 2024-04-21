import { Global, Module } from "@nestjs/common";
import { PaginationService } from "./pagination/pagination.service";
import { DatabaseModule } from "../db/db.module";

@Global()
@Module({
	imports: [DatabaseModule],
	providers: [PaginationService],
	exports: [PaginationService]
})
export class CommonModule {}
