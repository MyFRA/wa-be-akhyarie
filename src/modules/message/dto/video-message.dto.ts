import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { FileSystemStoredFile, HasMimeType, IsFile, MaxFileSize } from "nestjs-form-data";
import { videoMIMEType } from "src/utils/mime-type/mime-type.decorator";

export class VideoMessageDto {
    @IsNotEmpty()
    @IsUUID('all')
    device_uuid: string;

    @IsNotEmpty()
    @IsUUID('all')
    contact_uuid: string;

    @IsNotEmpty()
    @IsString()
    text: string;

    @IsNotEmpty()
    @IsFile()
    @MaxFileSize(11e6)
    @HasMimeType(videoMIMEType)
    video: FileSystemStoredFile;
}
