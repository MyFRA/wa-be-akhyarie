import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { FileSystemStoredFile, HasMimeType, IsFile, MaxFileSize } from "nestjs-form-data";

export class VideoMessageBroadcastDto {
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
    @MaxFileSize(11e6)
    @HasMimeType(['video/mp4', 'video/3gpp', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'])
    video: FileSystemStoredFile;
}
