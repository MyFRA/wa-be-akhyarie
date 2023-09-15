import { Controller, Post, Body, Res } from '@nestjs/common';
import { MessageService } from './message.service';
import { AudioMessageDto, DocumentMessageDto, ImageMessageDto, TextMessageDto, VideoMessageDto } from './dto';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { Response } from 'express';

@Controller('api/send-messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  @Post('text')
  @FormDataRequest()
  async sendText(@Body() textMessageDto: TextMessageDto, @Res() res: Response) {
    const dataTextMessage = await this.messageService.sendText(textMessageDto);

    return res.status(200).json({
      code: 200,
      msg: `Message '${dataTextMessage.text}' successfully sent to ${dataTextMessage.to}.`,
    });
  }

  @Post('document')
  @FormDataRequest({ storage: FileSystemStoredFile })
  async sendDocument(@Body() documentMessageDto: DocumentMessageDto, @Res() res: Response) {
    const { to, text } = await this.messageService.sendDocument(documentMessageDto);

    return res.status(200).json({
      code: 200,
      msg: `Message '${text}' with document successfully sent to ${to}.`,
    });
  }

  @Post('image')
  @FormDataRequest({ storage: FileSystemStoredFile })
  async sendImage(@Body() imageMessageDto: ImageMessageDto, @Res() res: Response) {
    const { to, text } = await this.messageService.sendImage(imageMessageDto);

    return res.status(200).json({
      code: 200,
      msg: `Message '${text}' with image successfully sent to ${to}.`,
    });
  }

  @Post('video')
  @FormDataRequest({ storage: FileSystemStoredFile })
  async sendVideo(@Body() videoMessageDto: VideoMessageDto, @Res() res: Response) {
    const { to, text } = await this.messageService.sendVideo(videoMessageDto);

    return res.status(200).json({
      code: 200,
      msg: `Message '${text}' with video successfully sent to ${to}.`,
    });
  }

  @Post('audio')
  @FormDataRequest({ storage: FileSystemStoredFile })
  async sendAudio(@Body() audioMessageDto: AudioMessageDto, @Res() res: Response) {
    const to = await this.messageService.sendAudio(audioMessageDto);

    return res.status(200).json({
      code: 200,
      msg: `Message with audio successfully sent to ${to}.`,
    });
  }
}
