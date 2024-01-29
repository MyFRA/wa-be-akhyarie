import { Injectable } from '@nestjs/common';
import { CreateContactGroupHasContactDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { errorHandler } from 'src/utils/error-handler/error-handler';

@Injectable()
export class ContactGroupHasContactService {
    constructor(private prisma: PrismaService) {}

    async create(createContactGroupHasContactDto: CreateContactGroupHasContactDto, user_uuid: string) {
        const contact = await this.findContact(createContactGroupHasContactDto.contact_uuid);

        if (!contact) {
            errorHandler(400, 'Contact not found!');
        }

        const contactGroup = await this.findContactGroup(createContactGroupHasContactDto.contact_group_uuid);

        if (!contactGroup) {
            errorHandler(400, 'Contact group not found!');
        }

        const contactInContactGroup = await this.findContactInContactGroup(createContactGroupHasContactDto.contact_group_uuid, createContactGroupHasContactDto.contact_uuid);

        if (contactInContactGroup) {
            errorHandler(400, 'Contact is already in the group!');
        }

        try {
            const createContactGroupHasContact = await this.prisma.cONTACT_GROUP_HAS_CONTACTS.create({
                data: {
                    user_uuid: user_uuid,
                    contact_uuid: createContactGroupHasContactDto.contact_uuid,
                    contact_group_uuid: createContactGroupHasContactDto.contact_group_uuid,
                },
            });

            return createContactGroupHasContact;
        } catch (error) {
            errorHandler(400, 'Error! Please contact the administrator.');
        }
    }

    async findAll(user_uuid: string) {
        const contactGroupHasContacts = await this.prisma.cONTACT_GROUP_HAS_CONTACTS.findMany({
            where: { user_uuid },
            orderBy: [{ created_at: 'asc' }],
        });

        return contactGroupHasContacts;
    }

    async findOne(uuid: string) {
        return await this.prisma.cONTACT_GROUP_HAS_CONTACTS.findUnique({ where: { uuid } });
    }

    async findContact(uuid: string) {
        return await this.prisma.cONTACTS.findUnique({ where: { uuid } });
    }

    async findContactGroup(uuid: string) {
        return await this.prisma.cONTACT_GROUPS.findUnique({ where: { uuid } });
    }

    async findContactGroupInContactGroupHasContact(contact_group_uuid: string) {
        return await this.prisma.cONTACT_GROUP_HAS_CONTACTS.findMany({ where: { contact_group_uuid } });
    }

    async findContactInContactGroup(contact_group_uuid: string, contact_uuid: string) {
        return await this.prisma.cONTACT_GROUP_HAS_CONTACTS.findFirst({ where: { contact_group_uuid, contact_uuid } });
    }

    async remove(uuid: string) {
        const contactGroupHasContact = await this.findOne(uuid);

        if (!contactGroupHasContact) {
            errorHandler(400, 'Contact failed to delete! Record not found in contact group.');
        }

        try {
            return await this.prisma.cONTACT_GROUP_HAS_CONTACTS.delete({ where: { uuid } });
        } catch (error) {
            errorHandler(400, 'Error! Please contact the administrator.');
        }
    }
}
