import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class TextMessageBroadcastDto {
    @IsNotEmpty()
    @IsUUID('all')
    device_uuid: string;

    @IsNotEmpty()
    @IsUUID('all')
    contact_group_uuid: string;

    @IsNotEmpty()
    @IsString()
    text: string;
}
