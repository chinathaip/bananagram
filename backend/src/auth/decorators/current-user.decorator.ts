import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtPayload } from "../dto/auth.dto";

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext): JwtPayload => {
	const ctx = GqlExecutionContext.create(context).getContext();
	return ctx.req.user?.id;
});

export const CurrentWebSocketUesr = createParamDecorator((data: unknown, context: ExecutionContext): JwtPayload => {
	const req = context.switchToHttp().getRequest();
	return req.handshake.user.id;
});
