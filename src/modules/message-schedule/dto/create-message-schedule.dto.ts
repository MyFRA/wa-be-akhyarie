import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { FileSystemStoredFile } from "nestjs-form-data";

export class CreateMessageScheduleDto {
    @IsNotEmpty()
    @IsUUID('all')
    device_uuid: string;

    @IsNotEmpty()
    @IsUUID('all')
    contact_group_uuid: string;

    @IsNotEmpty()
    @IsEnum(['text', 'audio', 'image', 'video', 'document'],
        { message: 'message_type must be one of the following values: text, audio, image, video, document' })
    message_type: string;

    @IsNotEmpty()
    message: string | FileSystemStoredFile;

    @IsNotEmpty()
    @IsEnum(['daily', 'weekly', 'monthly'],
        { message: 'schedule_type must be one of the following values: daily, weekly, monthly' })
    schedule_type: string;

    @IsNotEmpty()
    schedule_value: string;
}
