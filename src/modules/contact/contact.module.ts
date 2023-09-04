import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { AuthMiddleware } from 'src/middleware';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  controllers: [ContactController],
  providers: [ContactService],
  imports: [NestjsFormDataModule],
})
export class ContactModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'api/contacts', method: RequestMethod.GET },
        { path: 'api/contacts', method: RequestMethod.POST },
        { path: 'api/contacts/:uuid', method: RequestMethod.GET },
        { path: 'api/contacts/:uuid', method: RequestMethod.PATCH },
        { path: 'api/contacts/:uuid', method: RequestMethod.DELETE },
      )
  }
}
