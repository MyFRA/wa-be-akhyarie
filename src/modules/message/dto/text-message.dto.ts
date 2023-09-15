import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class TextMessageDto {
    @IsNotEmpty()
    @IsUUID('all')
    device_uuid: string;

    @IsNotEmpty()
    @IsUUID('all')
    contact_uuid: string;

    @IsNotEmpty()
    @IsString()
    text: string;
}
