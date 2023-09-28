import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { MessageScheduleService } from './message-schedule.service';
import { CreateMessageScheduleDto, UpdateMessageScheduleDto } from './dto';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { Response } from 'express';
import { UUIDParam } from 'src/helpers/uuid-helper';

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
  async findAll(@Res() res: Response) {
    const messageSchedules = await this.messageScheduleService.findAll();

    return res.status(200).json({
      code: 200,
      msg: 'Here is your contacts.',
      data: messageSchedules,
    });
  }

  @Get(':uuid')
  async findOne(@UUIDParam('uuid') uuid: string, @Res() res: Response) {
    const messageSchedule = await this.messageScheduleService.findOne(uuid);

    return res.status(200).json({
      code: 200,
      msg: 'Here is your contact.',
      data: messageSchedule,
    });
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
