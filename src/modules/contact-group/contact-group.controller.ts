import { Controller, Get, Post, Body, Patch, Delete, Res, Req } from '@nestjs/common';
import { ContactGroupService } from './contact-group.service';
import { CreateContactGroupDto, UpdateContactGroupDto } from './dto';
import { UUIDParam } from 'src/helpers/UuidHelper';
import { TokenHelper } from 'src/helpers/tokenHelper/token.service';
import { Request, Response } from 'express';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('api/contact-groups')
export class ContactGroupController {
  constructor(private readonly contactGroupService: ContactGroupService, private readonly tokenHelper: TokenHelper) { }

  @Post()
  @FormDataRequest()
  async create(@Body() createContactGroupDto: CreateContactGroupDto, @Res() res: Response, @Req() req: Request) {
    const user = this.tokenHelper.decode(req.headers.authorization.replace('Bearer ', ''))

    const createdContactGroup = await this.contactGroupService.create(createContactGroupDto, user.uuid);

    return res.status(200).json({
      code: 200,
      msg: `Contact group ${createdContactGroup.name} successfully created.`,
    });
  }

  @Get()
  async findAll(@Res() res: Response, @Req() req: Request) {
    const user = this.tokenHelper.decode(req.headers.authorization.replace('Bearer ', ''))

    const contactGroups = await this.contactGroupService.findAll(user.uuid);

    return res.status(200).json({
      code: 200,
      msg: 'Here is your contact groups.',
      data: contactGroups,
    });
  }

  @Get(':uuid')
  async findOne(@UUIDParam('uuid') uuid: string, @Res() res: Response) {
    console.log(uuid)
    const contactGroup = await this.contactGroupService.findOne(uuid);

    return res.status(200).json({
      code: 200,
      msg: 'Here is your contact group.',
      data: contactGroup,
    });
  }

  @Patch(':uuid')
  @FormDataRequest()
  async update(@UUIDParam('uuid') uuid: string, @Body() updateContactGroupDto: UpdateContactGroupDto, @Res() res: Response) {
    const updatedContactGroup = await this.contactGroupService.update(uuid, updateContactGroupDto);

    return res.status(200).json({
      code: 200,
      msg: `Device ${updatedContactGroup.name} successfully updated.`,
    });
  }

  @Delete(':uuid')
  async remove(@UUIDParam('uuid') uuid: string, @Res() res: Response) {
    const deletedContactGroup = await this.contactGroupService.remove(uuid);

    return res.status(200).json({
      code: 200,
      msg: `Device ${deletedContactGroup.name} successfully updated.`,
    });
  }
}