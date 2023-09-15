import { Controller, Post, Body, Res } from '@nestjs/common';
import { MessageBroadcastService } from './message-broadcast.service';
import { TextMessageBroadcastDto } from './dto';
import { FormDataRequest } from 'nestjs-form-data';
import { Response } from 'express';

@Controller('api/send-broadcast-messages')
export class MessageBroadcastController {
  constructor(private readonly messageBroadcastService: MessageBroadcastService) { }

  @Post('text')
  @FormDataRequest()
  async sendText(@Body() textMessageBroadcastDto: TextMessageBroadcastDto, @Res() res: Response) {
    const { data, contactGroup } = await this.messageBroadcastService.sendText(textMessageBroadcastDto);

    return res.status(200).json({
      code: 200,
      msg: `Broadcast Message ${data.data[0].text} successfully sent to group ${contactGroup.name}.`,
    });
  }
}
