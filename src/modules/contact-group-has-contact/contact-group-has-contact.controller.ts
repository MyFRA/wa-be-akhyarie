import { Controller, Get, Post, Body, Delete, Req, Res } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { ContactGroupHasContactService } from './contact-group-has-contact.service';
import { CreateContactGroupHasContactDto } from './dto';
import { TokenHelper } from 'src/helpers/tokenHelper/token.service';
import { Request, Response } from 'express';
import { UUIDParam } from 'src/helpers/UuidHelper';

@Controller('api/contact-group-has-contacts')
export class ContactGroupHasContactController {
  constructor(private readonly contactGroupHasContactService: ContactGroupHasContactService, private readonly tokenHelper: TokenHelper) { }

  @Post()
  @FormDataRequest()
  async create(@Body() createContactGroupHasContactDto: CreateContactGroupHasContactDto, @Res() res: Response, @Req() req: Request) {
    const user = this.tokenHelper.decode(req.headers.authorization.replace('Bearer ', ''))

    const createdContactGroupHasContact = await this.contactGroupHasContactService.create(createContactGroupHasContactDto, user.uuid);

    return res.status(200).json({
      code: 200,
      msg: `Contact has been successfully added to contact group.`,
    });
  }

  @Get()
  async findAll(@Res() res: Response, @Req() req: Request) {
    const user = this.tokenHelper.decode(req.headers.authorization.replace('Bearer ', ''))

    const contactGroupHasContacts = await this.contactGroupHasContactService.findAll(user.uuid);

    return res.status(200).json({
      code: 200,
      msg: 'Here is your contact group has contacts.',
      data: contactGroupHasContacts,
    });
  }

  @Delete(':uuid')
  async remove(@UUIDParam('uuid') uuid: string, @Res() res: Response) {
    const deletedContactGroupHasContact = await this.contactGroupHasContactService.remove(uuid);

    return res.status(200).json({
      code: 200,
      msg: `Contact has been successfully deleted from contact group.`,
    });
  }
}
