import { Injectable } from '@nestjs/common';
import { CreateContactDto, UpdateContactDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { errorHandler } from 'src/utils/error-handler/error-handler';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) { }

  async create(createContactDto: CreateContactDto, user_uuid: string) {
    try {
      const createContact = await this.prisma.cONTACTS.create({
        data: {
          user_uuid: user_uuid,
          name: createContactDto.name,
          phone_number: createContactDto.phone_number,
        }
      });

      return createContact;

    } catch (error) {
      errorHandler(422, 'Error! Please contact the administrator.')
    }
  }

  async findAll(user_uuid: string) {
    const contacts = await this.prisma.cONTACTS.findMany({
      where: { user_uuid },
      orderBy: [{ name: 'asc' }]
    })

    return contacts
  }

  async findOne(uuid: string) {
    return await this.prisma.cONTACTS.findUnique({ where: { uuid } })
  }

  async update(uuid: string, updateContactDto: UpdateContactDto) {
    const contactInUpdate = await this.findOne(uuid);

    if (!contactInUpdate) {
      errorHandler(422, 'Contact failed to update! Record not found.')
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
      errorHandler(422, 'Error! Please contact the administrator.')

    }
  }

  async remove(uuid: string) {
    const contact = await this.findOne(uuid)

    if (!contact) {
      errorHandler(422, 'Contact failed to delete! Record not found.')
    }

    try {
      return await this.prisma.cONTACTS.delete({ where: { uuid } })
    } catch (error) {
      errorHandler(422, 'Error! Please contact the administrator.')
    }
  }
}
