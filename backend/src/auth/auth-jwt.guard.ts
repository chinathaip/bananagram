import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
	getRequest(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		return ctx.getContext().req;
	}
}

@Injectable()
export class JwtAuthGuardOptional extends AuthGuard(["jwt", "anonymous"]) {
	getRequest(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		return ctx.getContext().req;
	}
}

@Injectable()
export class JwtWSAuthGuard extends AuthGuard("websocket") {
	getRequest(context: ExecutionContext) {
		return context.switchToWs().getClient().handshake;
	}
}
