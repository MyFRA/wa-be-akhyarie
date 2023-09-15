import { Injectable } from "@nestjs/common";
import { ContactGroupHasContactService } from "src/modules/contact-group-has-contact/contact-group-has-contact.service";
import { ContactGroupService } from "src/modules/contact-group/contact-group.service";
import { ContactService } from "src/modules/contact/contact.service";
import { DeviceService } from "src/modules/device/device.service";

@Injectable()
export class validatorHelper {
    constructor(
        private readonly contactService: ContactService,
        private readonly contactGroupService: ContactGroupService,
        private readonly contactGroupHasContactService: ContactGroupHasContactService,
        private readonly deviceService: DeviceService,) { }

    async validateContact(contact_uuid: string) {
        return await this.contactService.findOne(contact_uuid);
    }

    async validateContactGroup(contact_group_uuid: string) {
        return await this.contactGroupService.findOne(contact_group_uuid);
    }

    async validateContactGroupInContactGroupHasContact(contact_group_uuid: string) {
        return await this.contactGroupHasContactService.findContactGroupInContactGroupHasContact(contact_group_uuid);
    }

    async validateDevice(device_uuid: string) {
        return await this.deviceService.findOne(device_uuid);
    }
}