import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateContactGroupDto } from './dto/create-contact-group.dto';
import { UpdateContactGroupDto } from './dto/update-contact-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContactGroupService {
  constructor(private prisma: PrismaService) { }

  async create(createContactGroupDto: CreateContactGroupDto, user_uuid: string) {
    try {
      const createContactGroup = await this.prisma.cONTACT_GROUPS.create({
        data: {
          user_uuid: user_uuid,
          name: createContactGroupDto.name,
        }
      });

      return createContactGroup;

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
    const contactGroups = await this.prisma.cONTACT_GROUPS.findMany({
      where: { user_uuid },
      orderBy: [{ name: 'asc' }]
    })

    return contactGroups
  }

  async findOne(uuid: string) {
    return await this.prisma.cONTACT_GROUPS.findUnique({ where: { uuid } })
  }

  async update(uuid: string, updateContactGroupDto: UpdateContactGroupDto) {
    const contactGroup = await this.findOne(uuid);

    if (!contactGroup) {
      throw new HttpException(
        {
          code: HttpStatus.UNPROCESSABLE_ENTITY,
          msg: 'Contact group failed to update! Record not found.',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    try {
      const updateContactGroup = await this.prisma.cONTACT_GROUPS.update({
        where: { uuid },
        data: {
          name: updateContactGroupDto.name,
        },
      });

      return updateContactGroup;
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

  async remove(uuid: string) {
    const contactGroup = await this.findOne(uuid)

    if (!contactGroup) {
      throw new HttpException(
        {
          code: HttpStatus.UNPROCESSABLE_ENTITY,
          msg: 'Contact group failed to delete! Record not found.',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    try {
      return await this.prisma.cONTACT_GROUPS.delete({ where: { uuid } })
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
