import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MessageScheduleService } from './message-schedule.service';
import { MessageScheduleController } from './message-schedule.controller';
import { AuthMiddleware } from 'src/middleware';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  controllers: [MessageScheduleController],
  providers: [MessageScheduleService],
  imports: [NestjsFormDataModule],
})
export class MessageScheduleModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'api/message-schedules', method: RequestMethod.GET },
        { path: 'api/message-schedules', method: RequestMethod.POST },
        { path: 'api/message-schedules/:uuid', method: RequestMethod.GET },
        { path: 'api/message-schedules/:uuid', method: RequestMethod.PATCH },
        { path: 'api/message-schedules/:uuid', method: RequestMethod.DELETE },
      )
  }
}

