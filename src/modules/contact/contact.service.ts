import { Injectable } from '@nestjs/common';
import { CreateContactDto, UpdateContactDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { errorHandler } from 'src/utils/error-handler/error-handler';

@Injectable()
export class ContactService {
    constructor(private prisma: PrismaService) {}

    async create(createContactDto: CreateContactDto, user_uuid: string) {
        const contact = await this.findByPhoneNumberAndUserUuid(createContactDto.phone_number, user_uuid);

        if (contact) {
            errorHandler(400, 'Contact failed to create! Phone number is already in use.');
        }

        try {
            const createContact = await this.prisma.cONTACTS.create({
                data: {
                    user_uuid: user_uuid,
                    name: createContactDto.name,
                    phone_number: createContactDto.phone_number,
                    contact_group_uuid: createContactDto.contact_group_uuid,
                },
            });

            return createContact;
        } catch (error) {
            console.log(error);
            errorHandler(400, 'Error! Please contact the administrator.');
        }
    }

    async findAll(user_uuid: string, except_contact_group_uuid?: string) {
        //check except_contact_group_uuid is valid contact_group_uuid
        if (except_contact_group_uuid) {
            const contactGroup = await this.prisma.cONTACT_GROUPS.findUnique({ where: { uuid: except_contact_group_uuid } });
            if (!contactGroup) {
                errorHandler(400, 'Contact group not found! Failed to get all contacts except in contact group.');
            }
        }

        try {
            const contacts = await this.prisma.$queryRaw`
      SELECT * FROM public."CONTACTS" 
        WHERE user_uuid = CAST(${user_uuid} AS UUID) 
          AND uuid NOT IN (SELECT contact_uuid FROM public."CONTACT_GROUP_HAS_CONTACTS" WHERE contact_group_uuid = CAST(${except_contact_group_uuid} AS UUID)) 
        ORDER BY name ASC;`;

            return contacts;
        } catch (error) {
            errorHandler(400, 'Error! Please contact the administrator.');
        }
    }

    async findOne(uuid: string) {
        return await this.prisma.cONTACTS.findUnique({ where: { uuid } });
    }

    async getByContactGroupUuid(contact_group_uuid: string) {
        return await this.prisma.$queryRaw`
        SELECT * FROM public."CONTACTS" 
          WHERE contact_group_uuid = CAST(${contact_group_uuid} AS UUID) 
          ORDER BY name ASC;`;
    }

    async findByPhoneNumber(phone_number: string) {
        return await this.prisma.cONTACTS.findFirst({ where: { phone_number } });
    }

    async findByPhoneNumberAndUserUuid(phone_number: string, user_uuid: string) {
        return await this.prisma.cONTACTS.findFirst({ where: { phone_number, user_uuid } });
    }

    async update(uuid: string, updateContactDto: UpdateContactDto) {
        const contactInUpdate = await this.findOne(uuid);

        if (!contactInUpdate) {
            errorHandler(400, 'Contact failed to update! Record not found.');
        }

        // Check duplicate Phone number
        const contactByPhoneNumber = await this.findByPhoneNumber(updateContactDto.phone_number);

        if (contactByPhoneNumber) {
            if (updateContactDto.phone_number == contactByPhoneNumber.phone_number && contactInUpdate.phone_number !== updateContactDto.phone_number) {
                errorHandler(400, 'Contact failed to update! Phone number already in use.');
            }
        }

        try {
            const updateContact = await this.prisma.cONTACTS.update({
                where: { uuid },
                data: {
                    name: updateContactDto.name,
                    phone_number: updateContactDto.phone_number,
                },
            });

            return updateContact;
        } catch (error) {
            errorHandler(400, 'Error! Please contact the administrator.');
        }
    }

    async remove(uuid: string) {
        const contact = await this.findOne(uuid);

        if (!contact) {
            errorHandler(400, 'Contact failed to delete! Record not found.');
        }

        try {
            return await this.prisma.cONTACTS.delete({ where: { uuid } });
        } catch (error) {
            errorHandler(400, 'Error! Please contact the administrator.');
        }
    }
}
