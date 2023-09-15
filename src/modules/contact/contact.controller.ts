import { Controller, Get, Post, Body, Patch, Delete, Req, Res } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto, UpdateContactDto } from './dto';
import { TokenHelper } from 'src/helpers/token-helper/token.service';
import { Request, Response } from 'express';
import { UUIDParam } from 'src/helpers/uuid-helper';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('api/contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService, private readonly tokenHelper: TokenHelper) { }

  @Post()
  @FormDataRequest()
  async create(@Body() createContactDto: CreateContactDto, @Res() res: Response, @Req() req: Request) {
    const user = this.tokenHelper.decode(req.headers.authorization.replace('Bearer ', ''))

    const createdContact = await this.contactService.create(createContactDto, user.uuid);

    return res.status(200).json({
      code: 200,
      msg: `Contact ${createdContact.name} successfully created.`,
    });
  }

  @Get()
  async findAll(@Res() res: Response, @Req() req: Request) {
    const user = this.tokenHelper.decode(req.headers.authorization.replace('Bearer ', ''))

    const contacts = await this.contactService.findAll(user.uuid);

    return res.status(200).json({
      code: 200,
      msg: 'Here is your contacts.',
      data: contacts,
    });
  }

  @Get(':uuid')
  async findOne(@UUIDParam('uuid') uuid: string, @Res() res: Response) {
    console.log(uuid)
    const contact = await this.contactService.findOne(uuid);

    return res.status(200).json({
      code: 200,
      msg: 'Here is your contact.',
      data: contact,
    });
  }

  @Patch(':uuid')
  @FormDataRequest()
  async update(@UUIDParam('uuid') uuid: string, @Body() updateContactDto: UpdateContactDto, @Res() res: Response) {
    const updatedContact = await this.contactService.update(uuid, updateContactDto);

    return res.status(200).json({
      code: 200,
      msg: `Device ${updatedContact.name} successfully updated.`,
    });
  }

  @Delete(':uuid')
  async remove(@UUIDParam('uuid') uuid: string, @Res() res: Response) {
    const deletedContact = await this.contactService.remove(uuid);

    return res.status(200).json({
      code: 200,
      msg: `Device ${deletedContact.name} successfully deleted.`,
    });
  }
}
