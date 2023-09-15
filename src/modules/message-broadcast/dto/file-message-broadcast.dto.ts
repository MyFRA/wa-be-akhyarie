import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { FileSystemStoredFile, HasMimeType, IsFile, MaxFileSize } from "nestjs-form-data";

export class FileMessageBroadcastDto {
    @IsNotEmpty()
    @IsUUID('all')
    device_uuid: string;

    @IsNotEmpty()
    @IsUUID('all')
    contact_group_uuid: string;

    @IsNotEmpty()
    @IsString()
    text: string;

    @IsNotEmpty()
    @IsFile()
    @MaxFileSize(10e6)
    @HasMimeType(['image/jpeg', 'image/png', 'image/jpg'])
    image: FileSystemStoredFile;
}
