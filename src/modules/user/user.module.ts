import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AuthAdminMiddleware, AuthMiddleware } from 'src/middleware';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [NestjsFormDataModule],
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'api/users', method: RequestMethod.GET },
        { path: 'api/users', method: RequestMethod.PATCH },
        { path: 'api/users/:uuid', method: RequestMethod.PATCH },
        { path: 'api/users/:uuid', method: RequestMethod.DELETE },
      )
      .apply(AuthAdminMiddleware)
      .forRoutes(
        { path: 'api/users', method: RequestMethod.GET },
        { path: 'api/users/:uuid', method: RequestMethod.PATCH },
        { path: 'api/users/:uuid', method: RequestMethod.DELETE },
      )
  }
}
