import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDeviceDto, UpdateDeviceDto } from './dto';
import { HttpService } from '@nestjs/axios';
import { WA_ENGINE } from '../../config';

@Injectable()
export class DeviceService {
  constructor(private prisma: PrismaService, private httpService: HttpService) { }



  async create(createDeviceDto: CreateDeviceDto, user_uuid: string) {
    try {
      const headersRequest = {
        'Content-Type': 'application/json', // afaik this one is not needed
      };

      const result = this.httpService.get(WA_ENGINE + `start-session?session=${createDeviceDto.name}&scan=true`, { headers: headersRequest });

      console.log(WA_ENGINE + `start-session?session=${createDeviceDto.name}&scan=true`)
      console.log(result)

      const createDevice = await this.prisma.dEVICES.create({
        data: {
          user_uuid: user_uuid,
          name: createDeviceDto.name,
          session_id: 'sess_id',
          api_key: 'key',
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
    const devices = await this.prisma.dEVICES.findMany({
      where: { user_uuid },
      orderBy: [{ name: 'asc' }]
    })

    return devices
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
}
