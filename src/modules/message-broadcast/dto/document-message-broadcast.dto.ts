import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { FileSystemStoredFile, HasMimeType, IsFile, MaxFileSize } from "nestjs-form-data";

export class DocumentMessageBroadcastDto {
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
    //accept pdf, doc, docx, xls, xlsx, ppt, pptx, zip, rar, tar, bz, bz2, gz, 7z
    @HasMimeType([
        'application/pdf',
        'applicatyion/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/zip',
        'application/x-rar-compressed',
        'application/x-tar',
        'application/x-bzip',
        'application/x-bzip2',
        'application/gzip',
        'application/x-7z-compressed',
    ])
    document: FileSystemStoredFile;
}
