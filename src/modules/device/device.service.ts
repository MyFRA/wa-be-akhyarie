import { Injectable } from '@nestjs/common';
import { CreateDeviceDto, UpdateDeviceDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { errorHandler } from 'src/utils/error-handler/error-handler';
import { WA_ENGINE } from '../../config';

@Injectable()
export class DeviceService {
  constructor(private prisma: PrismaService) { }

  async create(createDeviceDto: CreateDeviceDto, user_uuid: string) {
    try {
      const createDevice = await this.prisma.dEVICES.create({
        data: {
          user_uuid: user_uuid,
          name: createDeviceDto.name,
        }
      });

      return createDevice;

    } catch (error) {
      console.log(error)
      errorHandler(422, 'Error! Please contact the administrator.')
    }
  }

  async connect(uuid: string) {
    try {
      const device = await this.findOne(uuid);
      return await this.getContent(device.name)

    } catch (error) {
      console.log(error)
      errorHandler(422, 'Error! Please contact the administrator.')
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
      errorHandler(422, 'Device failed to update! Record not found.')
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
      errorHandler(422, 'Error! Please contact the administrator.')
    }
  }

  async remove(uuid: string) {
    const device = await this.findOne(uuid)

    if (!device) {
      errorHandler(422, 'Device failed to delete! Record not found.')
    }

    try {
      return await this.prisma.dEVICES.delete({ where: { uuid } })

    } catch (error) {
      errorHandler(422, 'Error! Please contact the administrator.')
    }
  }

  async getContent(name: string): Promise<string> {
    try {
      const result = await fetch(`${WA_ENGINE}start-session?session=${name}&scan=true`);
      const htmlText = await result.text();

      const qrValue = this.parseQRValueFromHTML(htmlText);

      console.log(qrValue)

      return qrValue;
    } catch (error) {
      errorHandler(422, 'Error! Please contact the administrator.')
    }
  }

  private parseQRValueFromHTML(htmlText: string) {
    const regex = /let qr = '([^']+)'/;
    const match = htmlText.match(regex);

    if (match && match[1]) {
      return match[1];
    } else {
      errorHandler(422, 'Error! Please contact the administrator.')
    }
  }

  async getDevice(name: string) {
    try {
      const result = await fetch(`${WA_ENGINE}get-session?session_name=${name}`);
      const device = JSON.parse(await result.text());

      return device.data;
    } catch (error) {
      errorHandler(422, 'Error! Please contact the administrator.')
    }
  }
}
