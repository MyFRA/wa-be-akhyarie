import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ContactGroupService } from './contact-group.service';
import { ContactGroupController } from './contact-group.controller';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AuthMiddleware } from 'src/middleware';

@Module({
  controllers: [ContactGroupController],
  providers: [ContactGroupService],
  imports: [NestjsFormDataModule],
})
export class ContactGroupModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'api/contact-groups', method: RequestMethod.GET },
        { path: 'api/contact-groups', method: RequestMethod.POST },
        { path: 'api/contact-groups/:uuid', method: RequestMethod.GET },
        { path: 'api/contact-groups/:uuid', method: RequestMethod.PATCH },
        { path: 'api/contact-groups/:uuid', method: RequestMethod.DELETE },
      )
  }
}
