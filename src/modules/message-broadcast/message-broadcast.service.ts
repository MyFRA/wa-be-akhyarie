import { Injectable } from '@nestjs/common';
import { errorHandler } from 'src/utils/error-handler/error-handler';
import { validatorHelper } from 'src/helpers/validator-helper/validator.service';
import { AudioMessageBroadcastDto, DocumentMessageBroadcastDto, TextMessageBroadcastDto } from './dto';
import { WA_ENGINE } from 'src/config';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import * as fs from 'fs';
import * as FormData from 'form-data';

@Injectable()
export class MessageBroadcastService {
  constructor(private validatorHelper: validatorHelper, private readonly httpService: HttpService) { }

  async sendText(textMessageBroadcastDto: TextMessageBroadcastDto) {
    // Validate device is existing
    const device = await this.validatorHelper.validateDevice(textMessageBroadcastDto.device_uuid);
    if (!device) {
      errorHandler(422, 'Device not found! Failed to send broadcast message.')
    }

    // Validate contact group is existing
    const contactGroup = await this.validatorHelper.validateContactGroup(textMessageBroadcastDto.contact_group_uuid);
    if (!contactGroup) {
      errorHandler(422, 'Contact group not found! Failed to send broadcast message.')
    }

    // Validate contact group has contacts
    const contactGroupHasContacts = await this.validatorHelper.validateContactGroupInContactGroupHasContact(textMessageBroadcastDto.contact_group_uuid);
    if (!contactGroupHasContacts) {
      errorHandler(422, `Contact group doesn't have contacts! Failed to send broadcast message.`)
    }

    try {
      const url = `${WA_ENGINE}send-bulk-message`;

      const requestConfig: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json',
        }
      };

      const payloadData = []

      for (let i = 0; i < contactGroupHasContacts.length; i++) {
        const objContact = contactGroupHasContacts[i];

        const contact = await this.validatorHelper.validateContact(objContact.contact_uuid);

        const data = { to: contact.phone_number, text: textMessageBroadcastDto.text };
        payloadData.push(data);
      }

      const data = {
        session: device.name,
        data: payloadData,
        delay: "5000"
      }

      const responseData = await lastValueFrom(
        this.httpService.post(url, data, requestConfig).pipe(
          map((response) => {
            return response.data;
          }),
        ),
      );

      return { data, contactGroup };
    } catch (error) {
      console.log(error)
      errorHandler(422, error.response.data.message)
    }
  }

  async sendAudio(audioMessageBroadcastDto: AudioMessageBroadcastDto) {
    // Validate device is existing
    const device = await this.validatorHelper.validateDevice(audioMessageBroadcastDto.device_uuid);
    if (!device) {
      errorHandler(422, 'Device not found! Failed to send broadcast audio message.')
    }

    // Validate contact group is existing
    const contactGroup = await this.validatorHelper.validateContactGroup(audioMessageBroadcastDto.contact_group_uuid);
    if (!contactGroup) {
      errorHandler(422, 'Contact group not found! Failed to send broadcast audio message.')
    }

    // Validate contact group has contacts
    const contactGroupHasContacts = await this.validatorHelper.validateContactGroupInContactGroupHasContact(audioMessageBroadcastDto.contact_group_uuid);
    if (!contactGroupHasContacts) {
      errorHandler(422, `Contact group doesn't have contacts! Failed to send broadcast audio message.`)
    }

    try {
      const url = `${WA_ENGINE}send-bulk-message-audio`;

      let formData = new FormData();
      formData.append('session', device.name);
      formData.append('delay', "5000");
      formData.append('audio', fs.createReadStream(audioMessageBroadcastDto.audio.path));

      for (let i = 0; i < contactGroupHasContacts.length; i++) {
        const objContact = contactGroupHasContacts[i];
        // Get contact
        const contact = await this.validatorHelper.validateContact(objContact.contact_uuid);

        const data = { to: contact.phone_number };

        formData.append('data', JSON.stringify(data));
      }

      console.log(formData)

      const requestConfig: AxiosRequestConfig = {
        headers: {
          ...formData.getHeaders(),
        }
      };

      const responseData = await lastValueFrom(
        this.httpService.post(url, formData, requestConfig).pipe(
          map((response) => {
            return response.data;
          }),
        ),
      );

      return contactGroup;
    } catch (error) {
      errorHandler(422, 'Error! Please contact the administrator.');
    }
  }

  async sendDocument(documentMessageBroadcastDto: DocumentMessageBroadcastDto) {
    // Validate device is existing
    const device = await this.validatorHelper.validateDevice(documentMessageBroadcastDto.device_uuid);
    if (!device) {
      errorHandler(422, 'Device not found! Failed to send broadcast document message.')
    }

    // Validate contact group is existing
    const contactGroup = await this.validatorHelper.validateContactGroup(documentMessageBroadcastDto.contact_group_uuid);
    if (!contactGroup) {
      errorHandler(422, 'Contact group not found! Failed to send broadcast document message.')
    }

    // Validate contact group has contacts
    const contactGroupHasContacts = await this.validatorHelper.validateContactGroupInContactGroupHasContact(documentMessageBroadcastDto.contact_group_uuid);
    if (!contactGroupHasContacts) {
      errorHandler(422, `Contact group doesn't have contacts! Failed to send broadcast document message.`)
    }

    try {
      const url = `${WA_ENGINE}send-bulk-message-document`;

      let formData = new FormData();
      formData.append('session', device.name);
      formData.append('text', documentMessageBroadcastDto.text);
      formData.append('delay', "5000");
      formData.append('document', fs.createReadStream(documentMessageBroadcastDto.document.path));

      for (let i = 0; i < contactGroupHasContacts.length; i++) {
        const objContact = contactGroupHasContacts[i];
        // Get contact
        const contact = await this.validatorHelper.validateContact(objContact.contact_uuid);

        const data = { to: contact.phone_number };

        formData.append('data', JSON.stringify(data));
      }

      console.log(formData)

      const requestConfig: AxiosRequestConfig = {
        headers: {
          ...formData.getHeaders(),
        }
      };

      const responseData = await lastValueFrom(
        this.httpService.post(url, formData, requestConfig).pipe(
          map((response) => {
            return response.data;
          }),
        ),
      );

      return contactGroup;
    } catch (error) {
      errorHandler(422, 'Error! Please contact the administrator.');
    }
  }
}
