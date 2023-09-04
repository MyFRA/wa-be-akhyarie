import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { NestjsFormDataModule } from "nestjs-form-data";
import { AuthMiddleware } from "src/middleware/auth.middleware";

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [NestjsFormDataModule]
})

export class AuthModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes(
                { path: 'auth/user', method: RequestMethod.GET },
                { path: 'auth/dashboard', method: RequestMethod.GET },
            )
    }
}
