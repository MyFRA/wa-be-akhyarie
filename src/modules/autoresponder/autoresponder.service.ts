import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAutoresponderDto } from './dto/create-autoresponder.dto';
import { errorHandler } from 'src/utils/error-handler/error-handler';

@Injectable()
export class AutoresponderService {
    constructor(private prisma: PrismaService) {}

    async findOne(uuid: string) {
        return await this.prisma.aUTO_REPLIES.findUnique({ where: { uuid } });
    }

    async findAll(user_uuid: string) {
        try {
            const autoresponders = await this.prisma.$queryRaw`
            select "AUTO_REPLIES".*, "DEVICES".name as device_name from "AUTO_REPLIES" 
                left join "DEVICES" 
                    on "AUTO_REPLIES"."device_uuid" = "DEVICES"."uuid" 
                left join "USERS" 
                    on "USERS"."uuid" = "DEVICES"."user_uuid" WHERE "USERS"."uuid" = CAST(${user_uuid} AS UUID);`;

            return autoresponders;
        } catch (error) {
            console.log(error);
            errorHandler(400, 'Error! Please contact the administrator.');
        }
    }

    async create(createAutoresponderDto: CreateAutoresponderDto) {
        try {
            const createAutoresponder = await this.prisma.aUTO_REPLIES.create({
                data: {
                    matching: createAutoresponderDto.matching,
                    reply: createAutoresponderDto.reply,
                    reply_type: createAutoresponderDto.reply_type,
                    device_uuid: createAutoresponderDto.device_uuid,
                    text_to_reply: createAutoresponderDto.text_to_reply,
                },
            });

            return createAutoresponder;
        } catch (error) {
            console.log(error);
            errorHandler(400, 'Error! Please contact the administrator.');
        }
    }

    async remove(uuid: string) {
        const autoresponder = await this.findOne(uuid);

        if (!autoresponder) {
            errorHandler(400, 'Autoresponder failed to delete! Record not found.');
        }

        try {
            return await this.prisma.aUTO_REPLIES.delete({ where: { uuid } });
        } catch (error) {
            errorHandler(400, 'Error! Please contact the administrator.');
        }
    }
}
