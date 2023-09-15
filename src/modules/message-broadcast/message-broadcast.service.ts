import { Injectable } from '@nestjs/common';
import { errorHandler } from 'src/utils/error-handler/error-handler';
import { validatorHelper } from 'src/helpers/validator-helper/validator.service';
import { TextMessageBroadcastDto } from './dto';
import { WA_ENGINE } from 'src/config';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';

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
}
