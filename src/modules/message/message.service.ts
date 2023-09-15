import { Injectable } from '@nestjs/common';
import { AudioMessageDto, DocumentMessageDto, ImageMessageDto, TextMessageDto, VideoMessageDto } from './dto';
import { errorHandler } from 'src/utils/error-handler/error-handler';
import { validatorHelper } from 'src/helpers/validator-helper/validator.service';
import { WA_ENGINE } from 'src/config';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import * as fs from 'fs';
import * as FormData from 'form-data';

@Injectable()
export class MessageService {
  constructor(private validatorHelper: validatorHelper, private readonly httpService: HttpService) { }

  async sendText(textMessageDto: TextMessageDto) {
    // Validate device is existing
    const device = await this.validatorHelper.validateDevice(textMessageDto.device_uuid);
    if (!device) {
      errorHandler(422, 'Device not found! Failed to send message.')
    }

    // Validate contact is existing
    const contact = await this.validatorHelper.validateContact(textMessageDto.contact_uuid);
    if (!contact) {
      errorHandler(422, 'Contact not found! Failed to send message.')
    }

    // Validate contact has phone number
    if (!contact.phone_number) {
      errorHandler(422, `Contact doesn't have phone number! Failed to send message.`)
    }

    try {
      const url = `${WA_ENGINE}send-message`;

      const requestConfig: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json',
        }
      };

      const data = {
        session: device.name,
        to: contact.phone_number,
        text: textMessageDto.text
      }

      const responseData = await lastValueFrom(
        this.httpService.post(url, data, requestConfig).pipe(
          map((response) => {
            console.log(response.data)
            return response.data;
          }),
        ),
      );

      return data;
    } catch (error) {
      console.log(error)
      errorHandler(422, error.response.data.message)
    }
  }

  async sendAudio(audioMessageDto: AudioMessageDto) {
    // Validate device is existing
    const device = await this.validatorHelper.validateDevice(audioMessageDto.device_uuid);
    if (!device) {
      errorHandler(422, 'Device not found! Failed to send audio message.')
    }

    // Validate contact is existing
    const contact = await this.validatorHelper.validateContact(audioMessageDto.contact_uuid);
    if (!contact) {
      errorHandler(422, 'Contact not found! Failed to send audio message.')
    }

    // Validate contact has phone number
    if (!contact.phone_number) {
      errorHandler(422, `Contact doesn't have phone number! Failed to send audio message.`)
    }

    try {
      const url = `${WA_ENGINE}send-message-audio`;

      const formData = new FormData();

      formData.append('session', device.name);
      formData.append('to', contact.phone_number);
      formData.append('audio', fs.createReadStream(audioMessageDto.audio.path));

      const requestConfig: AxiosRequestConfig = {
        headers: {
          ...formData.getHeaders(),
        }
      };

      const responseData = await lastValueFrom(
        this.httpService.post(url, formData, requestConfig).pipe(
          map((response) => {
            console.log(response.data)
            return response.data;
          }),
        ),
      );

      return contact.name;
    } catch (error) {
      console.log(error)
      errorHandler(422, 'Error! Please contact the administrator.')
    }
  }

  async sendDocument(documentMessageDto: DocumentMessageDto) {
    // Validate device is existing
    const device = await this.validatorHelper.validateDevice(documentMessageDto.device_uuid);
    if (!device) {
      errorHandler(422, 'Device not found! Failed to send document message.')
    }

    // Validate contact is existing
    const contact = await this.validatorHelper.validateContact(documentMessageDto.contact_uuid);
    if (!contact) {
      errorHandler(422, 'Contact not found! Failed to send document message.')
    }

    // Validate contact has phone number
    if (!contact.phone_number) {
      errorHandler(422, `Contact doesn't have phone number! Failed to send document message.`)
    }

    try {
      const url = `${WA_ENGINE}send-message-document`;

      console.log(documentMessageDto.document)

      const formData = new FormData();

      formData.append('session', device.name);
      formData.append('to', contact.phone_number);
      formData.append('text', documentMessageDto.text);
      formData.append('document', fs.createReadStream(documentMessageDto.document.path));

      console.log(formData)

      const requestConfig: AxiosRequestConfig = {
        headers: {
          ...formData.getHeaders(),
        }
      };

      const responseData = await lastValueFrom(
        this.httpService.post(url, formData, requestConfig).pipe(
          map((response) => {
            console.log(response.data)
            return response.data;
          }),
        ),
      );

      return { to: contact.name, text: documentMessageDto.text };
    } catch (error) {
      // console.log(error)
      errorHandler(422, 'Error! Please contact the administrator.')
    }
  }

  async sendImage(imageMessageDto: ImageMessageDto) {
    // Validate device is existing
    const device = await this.validatorHelper.validateDevice(imageMessageDto.device_uuid);
    if (!device) {
      errorHandler(422, 'Device not found! Failed to send image message.')
    }

    // Validate contact is existing
    const contact = await this.validatorHelper.validateContact(imageMessageDto.contact_uuid);
    if (!contact) {
      errorHandler(422, 'Contact not found! Failed to send image message.')
    }

    // Validate contact has phone number
    if (!contact.phone_number) {
      errorHandler(422, `Contact doesn't have phone number! Failed to send image message.`)
    }

    try {
      const url = `${WA_ENGINE}send-message-image`;

      console.log(imageMessageDto.image)

      const formData = new FormData();

      formData.append('session', device.name);
      formData.append('to', contact.phone_number);
      formData.append('text', imageMessageDto.text);
      formData.append('image', fs.createReadStream(imageMessageDto.image.path));

      console.log(formData)

      const requestConfig: AxiosRequestConfig = {
        headers: {
          ...formData.getHeaders(),
        }
      };

      const responseData = await lastValueFrom(
        this.httpService.post(url, formData, requestConfig).pipe(
          map((response) => {
            console.log(response.data)
            return response.data;
          }),
        ),
      );

      return { to: contact.name, text: imageMessageDto.text };
    } catch (error) {
      // console.log(error)
      errorHandler(422, 'Error! Please contact the administrator.')
    }
  }

  async sendVideo(videoMessageDto: VideoMessageDto) {
    // Validate device is existing
    const device = await this.validatorHelper.validateDevice(videoMessageDto.device_uuid);
    if (!device) {
      errorHandler(422, 'Device not found! Failed to send video message.')
    }

    // Validate contact is existing
    const contact = await this.validatorHelper.validateContact(videoMessageDto.contact_uuid);
    if (!contact) {
      errorHandler(422, 'Contact not found! Failed to send video message.')
    }

    // Validate contact has phone number
    if (!contact.phone_number) {
      errorHandler(422, `Contact doesn't have phone number! Failed to send video message.`)
    }

    try {
      const url = `${WA_ENGINE}send-message-video`;

      console.log(videoMessageDto.video)

      const formData = new FormData();

      formData.append('session', device.name);
      formData.append('to', contact.phone_number);
      formData.append('text', videoMessageDto.text);
      formData.append('video', fs.createReadStream(videoMessageDto.video.path));

      const requestConfig: AxiosRequestConfig = {
        headers: {
          ...formData.getHeaders(),
        }
      };

      const responseData = await lastValueFrom(
        this.httpService.post(url, formData, requestConfig).pipe(
          map((response) => {
            console.log(response.data)
            return response.data;
          }),
        ),
      );

      return { to: contact.name, text: videoMessageDto.text };
    } catch (error) {
      console.log(error)
      errorHandler(422, 'Error! Please contact the administrator.')
    }
  }
}
