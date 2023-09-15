import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { AuthMiddleware } from 'src/middleware';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports: [NestjsFormDataModule,
    HttpModule.register({
      timeout: 20000,
      maxRedirects: 5,
    }),],
})
export class MessageModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'api/send-messages/text', method: RequestMethod.POST },
      )
  }
}
