import { Controller, Post, Body, Res } from '@nestjs/common';
import { MessageBroadcastService } from './message-broadcast.service';
import { AudioMessageBroadcastDto, DocumentMessageBroadcastDto, ImageMessageBroadcastDto, TextMessageBroadcastDto, VideoMessageBroadcastDto } from './dto';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
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

  @Post('audio')
  @FormDataRequest({ storage: FileSystemStoredFile })
  async sendAudio(@Body() audioMessageBroadcastDto: AudioMessageBroadcastDto, @Res() res: Response) {
    const contactGroup = await this.messageBroadcastService.sendAudio(audioMessageBroadcastDto);

    return res.status(200).json({
      code: 200,
      msg: `Broadcast Message with audio successfully sent to group ${contactGroup.name}.`,
    });
  }

  @Post('document')
  @FormDataRequest({ storage: FileSystemStoredFile })
  async sendDocument(@Body() documentMessageBroadcastDto: DocumentMessageBroadcastDto, @Res() res: Response) {
    const contactGroup = await this.messageBroadcastService.sendDocument(documentMessageBroadcastDto);

    return res.status(200).json({
      code: 200,
      msg: `Broadcast Message with document successfully sent to group ${contactGroup.name}.`,
    });
  }

  @Post('image')
  @FormDataRequest({ storage: FileSystemStoredFile })
  async sendImage(@Body() imageMessageBroadcastDto: ImageMessageBroadcastDto, @Res() res: Response) {
    const contactGroup = await this.messageBroadcastService.sendImage(imageMessageBroadcastDto);

    return res.status(200).json({
      code: 200,
      msg: `Broadcast Message with image successfully sent to group ${contactGroup.name}.`,
    });
  }

  @Post('video')
  @FormDataRequest({ storage: FileSystemStoredFile })
  async sendVideo(@Body() videoMessageBroadcastDto: VideoMessageBroadcastDto, @Res() res: Response) {
    const contactGroup = await this.messageBroadcastService.sendVideo(videoMessageBroadcastDto);

    return res.status(200).json({
      code: 200,
      msg: `Broadcast Message with video successfully sent to group ${contactGroup.name}.`,
    });
  }
}
