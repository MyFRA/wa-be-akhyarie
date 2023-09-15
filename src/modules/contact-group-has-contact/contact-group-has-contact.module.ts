import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ContactGroupHasContactService } from './contact-group-has-contact.service';
import { ContactGroupHasContactController } from './contact-group-has-contact.controller';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AuthMiddleware } from 'src/middleware';

@Module({
  controllers: [ContactGroupHasContactController],
  providers: [ContactGroupHasContactService],
  imports: [NestjsFormDataModule],
  exports: [ContactGroupHasContactService],
})
export class ContactGroupHasContactModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'api/contact-group-has-contacts', method: RequestMethod.GET },
        { path: 'api/contact-group-has-contacts', method: RequestMethod.POST },
        { path: 'api/contact-group-has-contacts/:uuid', method: RequestMethod.GET },
        { path: 'api/contact-group-has-contacts/:uuid', method: RequestMethod.DELETE },
      )
  }
}
