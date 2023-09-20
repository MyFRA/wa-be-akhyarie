import { PartialType } from '@nestjs/swagger';
import { CreateMessageScheduleDto } from './create-message-schedule.dto';

export class UpdateMessageScheduleDto extends PartialType(CreateMessageScheduleDto) {}
