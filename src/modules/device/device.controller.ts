import { Controller, Get, Post, Body, Patch, Delete, Res, Req } from '@nestjs/common';
import { DeviceService } from './device.service';
import { Request, Response } from 'express';
import { TokenHelper } from 'src/helpers/tokenHelper/token.service';
import { UUIDParam } from 'src/helpers/UuidHelper';
import { FormDataRequest } from 'nestjs-form-data';
import { CreateDeviceDto, UpdateDeviceDto } from './dto';

@Controller('api/devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService, private readonly tokenHelper: TokenHelper) { }

  @Post()
  @FormDataRequest()
  async create(@Body() createDeviceDto: CreateDeviceDto, @Res() res: Response, @Req() req: Request) {
    const user = this.tokenHelper.decode(req.headers.authorization.replace('Bearer ', ''))

    const createdDevice = await this.deviceService.create(createDeviceDto, user.uuid);

    return res.status(200).json({
      code: 200,
      msg: `Device ${createdDevice.name} successfully created.`,
    });
  }

  @Get()
  async findAll(@Res() res: Response, @Req() req: Request) {
    const user = this.tokenHelper.decode(req.headers.authorization.replace('Bearer ', ''))

    const devices = await this.deviceService.findAll(user.uuid);

    return res.status(200).json({
      code: 200,
      msg: 'Here is your devices.',
      data: { devices },
    });
  }

  @Get(':uuid')
  async findOne(@UUIDParam('uuid') uuid: string, @Res() res: Response) {
    const device = await this.deviceService.findOne(uuid);

    return res.status(200).json({
      code: 200,
      msg: 'Here is your device.',
      data: device,
    });
  }

  @Patch(':uuid')
  @FormDataRequest()
  async update(@UUIDParam('uuid') uuid: string, @Body() updateDeviceDto: UpdateDeviceDto, @Res() res: Response) {
    const updatedDevice = await this.deviceService.update(uuid, updateDeviceDto);

    return res.status(200).json({
      code: 200,
      msg: `Device ${updatedDevice.name} successfully updated.`,
    });
  }

  @Delete(':uuid')
  async remove(@UUIDParam('uuid') uuid: string, @Res() res: Response) {
    const deletedDevice = await this.deviceService.remove(uuid);

    return res.status(200).json({
      code: 200,
      msg: `Device ${deletedDevice.name} successfully deleted.`,
    });
  }
}
