import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessageScheduleService } from './message-schedule.service';
import { CreateMessageScheduleDto } from './dto/create-message-schedule.dto';
import { UpdateMessageScheduleDto } from './dto/update-message-schedule.dto';

@Controller('message-schedule')
export class MessageScheduleController {
  constructor(private readonly messageScheduleService: MessageScheduleService) {}

  @Post()
  create(@Body() createMessageScheduleDto: CreateMessageScheduleDto) {
    return this.messageScheduleService.create(createMessageScheduleDto);
  }

  @Get()
  findAll() {
    return this.messageScheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageScheduleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageScheduleDto: UpdateMessageScheduleDto) {
    return this.messageScheduleService.update(+id, updateMessageScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageScheduleService.remove(+id);
  }
}
