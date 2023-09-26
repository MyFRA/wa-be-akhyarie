import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { MessageScheduleService } from './message-schedule.service';
import { CreateMessageScheduleDto, UpdateMessageScheduleDto } from './dto';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { Request, Response } from 'express';

@Controller('api/message-schedules')
export class MessageScheduleController {
  constructor(private readonly messageScheduleService: MessageScheduleService) { }

  @Post()
  @FormDataRequest({ storage: FileSystemStoredFile })
  async create(@Body() createMessageScheduleDto: CreateMessageScheduleDto, @Res() res: Response) {
    const createdMessageSchedule = await this.messageScheduleService.create(createMessageScheduleDto);

    return res.status(200).json({
      code: 200,
      msg: `Message schedule successfully created.`,
    });

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
