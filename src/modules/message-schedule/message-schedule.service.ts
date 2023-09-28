import { Injectable } from '@nestjs/common';
import { CreateMessageScheduleDto, UpdateMessageScheduleDto } from './dto';
import { validatorHelper } from 'src/helpers/validator-helper/validator.service';
import { errorHandler } from 'src/utils/error-handler/error-handler';
import { PrismaService } from 'src/prisma/prisma.service';
import { MESSAGE_SCHEDULES_message_type, MESSAGE_SCHEDULES_schedule_type } from '@prisma/client';
import { FileUploadHelper } from 'src/helpers/file-upload-helper/file-upload.service';
import * as mimeTypes from 'mime-types';
import { audioMIMEType, documentMIMEType, imageMIMEType, textMimeType, videoMIMEType } from 'src/utils/mime-type/mime-type.decorator';
import { FILE_URL } from 'src/config';

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


      const schedule_value = JSON.parse(createMessageScheduleDto.schedule_value)

      if (Object.keys(schedule_value).length !== 2 || !schedule_value.hasOwnProperty('key') || !schedule_value.hasOwnProperty('value')) {
        errorHandler(422, `Invalid schedule value! Expected an object with 'key' and 'value' properties only.`);
      }

      // Validate schedule value format
      if (schedule_value.value) {
        const scheduleValueRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
        if (!scheduleValueRegex.test(schedule_value.value)) {
          errorHandler(422, `Invalid schedule value format! Expected H:i:s format.`);
        }
      }

      // Validate schedule value key
      if (createMessageScheduleDto.schedule_type === 'daily') {
        if (schedule_value.key !== null) {
          errorHandler(422, `Invalid schedule value key! Expexted null value.`);
        }
      }

      if (createMessageScheduleDto.schedule_type === 'weekly') {
        const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        if (!weekdays.includes(schedule_value.key)) {
          errorHandler(422, `Invalid schedule value key! Expected between monday, tuesday, wednesday, thursday, friday, saturday, sunday.`);
        }
      }

      if (createMessageScheduleDto.schedule_type === 'monthly') {
        const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
        if (!daysInMonth.includes(parseInt(schedule_value.key))) {
          errorHandler(422, `Invalid schedule value key! Expected between 1 to 31.`);
        }
      }

      const createMessageSchedule = await this.prisma.mESSAGE_SCHEDULES.create({
        data: {
          device_uuid: createMessageScheduleDto.device_uuid,
          contact_group_uuid: createMessageScheduleDto.contact_group_uuid,
          message_type: createMessageScheduleDto.message_type.valueOf() as MESSAGE_SCHEDULES_message_type,
          message: message,
          schedule_type: createMessageScheduleDto.schedule_type.valueOf() as MESSAGE_SCHEDULES_schedule_type,
          schedule_value: schedule_value,
        }
      });

      return createMessageSchedule;

    } catch (error) {
      console.log(error)
      if (error.response) {
        if (error.response.code === 422) {
          errorHandler(error.response.code, error.response.msg[0])
        }
      }

      errorHandler(500, 'Error! Please contact the administrator.')
    }
  }

  async findAll() {
    const messageSchedules = await this.prisma.mESSAGE_SCHEDULES.findMany({ orderBy: [{ created_at: 'desc' }] })

    let extendedMessageSchedules = []
    for (let i = 0; i < messageSchedules.length; i++) {
      extendedMessageSchedules[i] = messageSchedules[i];
      extendedMessageSchedules[i].message_type === 'text' ? null : (extendedMessageSchedules[i].message = FILE_URL + 'MESSAGE-SCHEDULES/message/' + extendedMessageSchedules[i].message);
    }

    return extendedMessageSchedules
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
