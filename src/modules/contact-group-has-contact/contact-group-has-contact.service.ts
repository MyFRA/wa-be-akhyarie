import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateContactGroupHasContactDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContactGroupHasContactService {
  constructor(private prisma: PrismaService) { }

  async create(createContactGroupHasContactDto: CreateContactGroupHasContactDto, user_uuid: string) {
    const contact = await this.findContact(createContactGroupHasContactDto.contact_uuid)

    if (!contact) {
      throw new HttpException(
        {
          code: HttpStatus.UNPROCESSABLE_ENTITY,
          msg: 'Contact not found!',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const contactGroup = await this.findContactGroup(createContactGroupHasContactDto.contact_group_uuid)

    if (!contactGroup) {
      throw new HttpException(
        {
          code: HttpStatus.UNPROCESSABLE_ENTITY,
          msg: 'Contact group not found!',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    try {
      const createContactGroupHasContact = await this.prisma.cONTACT_GROUP_HAS_CONTACTS.create({
        data: {
          user_uuid: user_uuid,
          contact_uuid: createContactGroupHasContactDto.contact_uuid,
          contact_group_uuid: createContactGroupHasContactDto.contact_group_uuid,
        }
      });

      return createContactGroupHasContact;

    } catch (error) {
      throw new HttpException(
        {
          code: HttpStatus.UNPROCESSABLE_ENTITY,
          msg: "Error! Please Contact Admin.",
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async findAll(user_uuid: string) {
    const contactGroupHasContacts = await this.prisma.cONTACT_GROUP_HAS_CONTACTS.findMany({
      where: { user_uuid },
      orderBy: [{ created_at: 'asc' }]
    })

    return contactGroupHasContacts
  }

  async findOne(uuid: string) {
    return await this.prisma.cONTACT_GROUP_HAS_CONTACTS.findUnique({ where: { uuid } })
  }

  async findContact(uuid: string) {
    return await this.prisma.cONTACTS.findUnique({ where: { uuid } })
  }

  async findContactGroup(uuid: string) {
    return await this.prisma.cONTACT_GROUPS.findUnique({ where: { uuid } })
  }

  async remove(uuid: string) {
    const contactGroupHasContact = await this.findOne(uuid)

    if (!contactGroupHasContact) {
      throw new HttpException(
        {
          code: HttpStatus.UNPROCESSABLE_ENTITY,
          msg: 'Contact failed to delete! Record not found in contact group.',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    try {
      return await this.prisma.cONTACT_GROUP_HAS_CONTACTS.delete({ where: { uuid } })
    } catch (error) {
      throw new HttpException(
        {
          code: HttpStatus.UNPROCESSABLE_ENTITY,
          msg: "Error! Please Contact Admin.",
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
