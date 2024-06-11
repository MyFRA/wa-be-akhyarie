import { Body, Controller, Delete, Get, Post, Put, Req, Res } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { CreateAutoresponderDto } from './dto/create-autoresponder.dto';
import { TokenHelper } from 'src/helpers/token-helper/token.service';
import { AutoresponderService } from './autoresponder.service';
import { Request, Response } from 'express';
import { UUIDParam } from 'src/helpers/uuid-helper';
import { UpdateAutoresponderDto } from './dto/update-autoresponder.dto';

@Controller('api/autoresponders')
export class AutoresponderController {
    constructor(private readonly autoresponerService: AutoresponderService, private readonly tokenHelper: TokenHelper) {}

    @Get()
    async findAll(@Res() res: Response, @Req() req: Request) {
        const user = this.tokenHelper.decode(req.headers.authorization.replace('Bearer ', ''));

        const autoresponders = await this.autoresponerService.findAll(user.uuid);

        return res.status(200).json({
            code: 200,
            msg: 'Here is your autoresponders.',
            data: autoresponders,
        });
    }

    @Get(':uuid')
    async findOne(@UUIDParam('uuid') uuid: string, @Res() res: Response, @Req() req: Request) {
        const autoresponder = await this.autoresponerService.findOne(uuid);

        return res.status(200).json({
            code: 200,
            msg: 'Here is your autoresponder.',
            data: autoresponder,
        });
    }

    @Post()
    @FormDataRequest()
    async create(@Body() createAutoresponderDto: CreateAutoresponderDto, @Res() res: Response, @Req() req: Request) {
        this.autoresponerService.create(createAutoresponderDto);

        return res.status(200).json({
            code: 200,
            msg: `Autreply successfully created.`,
        });
    }

    @Put(':uuid')
    @FormDataRequest()
    async update(@UUIDParam('uuid') uuid: string, @Body() updateAutoresponderDto: UpdateAutoresponderDto, @Res() res: Response, @Req() req: Request) {
        this.autoresponerService.update(updateAutoresponderDto, uuid);

        return res.status(200).json({
            code: 200,
            msg: `Autreply successfully updated.`,
        });
    }

    @Delete(':uuid')
    async remove(@UUIDParam('uuid') uuid: string, @Res() res: Response) {
        await this.autoresponerService.remove(uuid);

        return res.status(200).json({
            code: 200,
            msg: `Autoresponder successfully deleted.`,
        });
    }
}
