import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDeviceDto, UpdateDeviceDto } from './dto';
import { WA_ENGINE } from '../../config';

@Injectable()
export class DeviceService {
  constructor(private prisma: PrismaService) { }

  async create(createDeviceDto: CreateDeviceDto) {
    try {
      return await this.getContent(createDeviceDto.name)

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

  async inputDevice(createDeviceDto: CreateDeviceDto, user_uuid: string) {
    try {
      const createDevice = await this.prisma.dEVICES.create({
        data: {
          user_uuid: user_uuid,
          name: createDeviceDto.name,
          session_id: createDeviceDto.session_id,
          api_key: createDeviceDto.api_key,
        }
      });

      return createDevice;

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
    return await this.prisma.dEVICES.findMany({
      where: { user_uuid },
      orderBy: [{ name: 'asc' }]
    })
  }

  async findOne(uuid: string) {
    return await this.prisma.dEVICES.findUnique({ where: { uuid } })
  }

  async update(uuid: string, updateDeviceDto: UpdateDeviceDto) {
    const deviceInUpdate = await this.findOne(uuid);

    if (!deviceInUpdate) {
      throw new HttpException(
        {
          code: HttpStatus.UNPROCESSABLE_ENTITY,
          msg: 'Device failed to update! Record not found.',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    try {
      const updateDevice = await this.prisma.dEVICES.update({
        where: { uuid },
        data: {
          name: updateDeviceDto.name,
        },
      });

      return updateDevice;
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
    const device = await this.findOne(uuid)

    if (!device) {
      throw new HttpException(
        {
          code: HttpStatus.UNPROCESSABLE_ENTITY,
          msg: 'Device failed to delete! Record not found.',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    try {
      return await this.prisma.dEVICES.delete({ where: { uuid } })

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

  async getContent(name: string): Promise<string> {
    try {
      const result = await fetch(`${WA_ENGINE}start-session?session=${name}&scan=true`);
      const htmlText = await result.text();

      const qrValue = this.parseQRValueFromHTML(htmlText);

      return qrValue;
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

  private parseQRValueFromHTML(htmlText: string) {
    const regex = /let qr = '([^']+)'/;
    const match = htmlText.match(regex);

    if (match && match[1]) {
      return match[1];
    } else {
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
