import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		cors: { origin: "*" }
	});
	app.setGlobalPrefix("_api");
	app.useGlobalPipes(new ValidationPipe());
	await app.listen(3001);
}
bootstrap();
