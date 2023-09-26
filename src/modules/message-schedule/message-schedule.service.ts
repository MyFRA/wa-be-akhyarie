import { Injectable } from '@nestjs/common';
import { CreateMessageScheduleDto, UpdateMessageScheduleDto } from './dto';
import { validatorHelper } from 'src/helpers/validator-helper/validator.service';
import { errorHandler, errorHandlerNotThrow } from 'src/utils/error-handler/error-handler';
import { PrismaService } from 'src/prisma/prisma.service';
import { MESSAGE_SCHEDULES_message_type } from '@prisma/client';
import { FileUploadHelper } from 'src/helpers/file-upload-helper/file-upload.service';
import * as mimeTypes from 'mime-types';
import { audioMIMEType, documentMIMEType, imageMIMEType, textMimeType, videoMIMEType } from 'src/utils/mime-type/mime-type.decorator';


@Injectable()
export class MessageScheduleService {
  constructor(private prisma: PrismaService, private readonly validatorHelper: validatorHelper, private readonly fileUploadHelper: FileUploadHelper) { }

  async create(createMessageScheduleDto: CreateMessageScheduleDto) {
    const device = await this.validatorHelper.validateDevice(createMessageScheduleDto.device_uuid);
    if (!device) {
      errorHandler(422, 'Device not found! Failed to send broadcast message.')
    }

    // Validate contact group is existing
    const contactGroup = await this.validatorHelper.validateContactGroup(createMessageScheduleDto.contact_group_uuid);
    if (!contactGroup) {
      errorHandler(422, 'Contact group not found! Failed to send broadcast message.')
    }

    try {
      let message: string;

      if (typeof createMessageScheduleDto.message === 'string') {
        message = createMessageScheduleDto.message;
      } else {
        // Validate message type
        let allowedMimeTypes: string[] = [];
        switch (createMessageScheduleDto.message_type) {
          case 'text':
            allowedMimeTypes = textMimeType;
            break;
          case 'image':
            allowedMimeTypes = imageMIMEType;
            break;
          case 'video':
            allowedMimeTypes = videoMIMEType;
            break;
          case 'audio':
            allowedMimeTypes = audioMIMEType;
            break;
          case 'document':
            allowedMimeTypes = documentMIMEType;
            break;
          default:
            errorHandler(422, `message_type must be one of the following values: text, audio, image, video, document`);
        }

        const mimeType = mimeTypes.lookup(createMessageScheduleDto.message.path);

        if (typeof mimeType === 'string' && !allowedMimeTypes.includes(mimeType)) {
          errorHandler(422, `Invalid message type! Allowed types: ${createMessageScheduleDto.message_type}`);
        }

        message = await this.fileUploadHelper.modelFileStore('MESSAGE_SCHEDULES', 'message', createMessageScheduleDto.message);
      }

      const createContact = await this.prisma.mESSAGE_SCHEDULES.create({
        data: {
          device_uuid: createMessageScheduleDto.device_uuid,
          contact_group_uuid: createMessageScheduleDto.contact_group_uuid,
          message_type: createMessageScheduleDto.message_type.valueOf() as MESSAGE_SCHEDULES_message_type,
          message: message,
          schedule_type: 'daily',
          schedule_value: new Date(),
        }
      });

      return createContact;

    } catch (error) {
      if (error.response.code === 422) {
        errorHandler(error.response.code, error.response.msg[0])
      }

      errorHandler(500, 'Error! Please contact the administrator.')
    }
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
