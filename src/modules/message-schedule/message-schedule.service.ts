import { Injectable } from '@nestjs/common';
import { CreateMessageScheduleDto } from './dto/create-message-schedule.dto';
import { UpdateMessageScheduleDto } from './dto/update-message-schedule.dto';

@Injectable()
export class MessageScheduleService {
  create(createMessageScheduleDto: CreateMessageScheduleDto) {
    return 'This action adds a new messageSchedule';
  }

  findAll() {
    return `This action returns all messageSchedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} messageSchedule`;
  }

  update(id: number, updateMessageScheduleDto: UpdateMessageScheduleDto) {
    return `This action updates a #${id} messageSchedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} messageSchedule`;
  }
}
