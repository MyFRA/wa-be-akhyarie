import { AUTO_REPLIES_matching, AUTO_REPLIES_reply_type } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

enum AUTO_REPLY_ENUM {
    'text',
    'image',
    'video',
    'audio',
    'document',
}

export class CreateAutoresponderDto {
    @IsNotEmpty()
    @IsUUID()
    device_uuid: string;

    @IsNotEmpty()
    @IsString()
    text_to_reply: string;

    @IsEnum(AUTO_REPLY_ENUM)
    @IsNotEmpty()
    reply_type: AUTO_REPLIES_reply_type;

    @IsNotEmpty()
    @IsString()
    reply: string;

    @IsNotEmpty()
    @IsEnum(['sentence', 'keyword'])
    matching: AUTO_REPLIES_matching;
}
