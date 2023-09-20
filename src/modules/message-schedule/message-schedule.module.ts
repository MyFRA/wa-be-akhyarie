import { Module } from '@nestjs/common';
import { MessageScheduleService } from './message-schedule.service';
import { MessageScheduleController } from './message-schedule.controller';

@Module({
  controllers: [MessageScheduleController],
  providers: [MessageScheduleService],
})
export class MessageScheduleModule {}
