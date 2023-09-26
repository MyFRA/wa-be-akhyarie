import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { FileSystemStoredFile, HasMimeType, IsFile, MaxFileSize } from "nestjs-form-data";
import { documentMIMEType } from "src/utils/mime-type/mime-type.decorator";

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
    @HasMimeType(documentMIMEType)
    document: FileSystemStoredFile;
}
