import { IsNotEmpty, IsUUID } from "class-validator";
import { FileSystemStoredFile, HasMimeType, IsFile, MaxFileSize } from "nestjs-form-data";
import { audioMIMEType } from "src/utils/mime-type/mime-type.decorator";

export class AudioMessageDto {
    @IsNotEmpty()
    @IsUUID('all')
    device_uuid: string;

    @IsNotEmpty()
    @IsUUID('all')
    contact_uuid: string;

    @IsNotEmpty()
    @IsFile()
    @MaxFileSize(11e6)
    // accept mpeg, ogg, wav, webm, 3gpp, 3gpp2, aac, mp4, midi, x-midi, x-mpegurl, x-ms-wma, x-wav, x-ms-wax, x-pn-realaudio, x-pn-realaudio-plugin, x-realaudio, x-pn-aiff, x-pn-au, x-pn-wav, x-pn-windows-acm, x-real-audio, x-scpls, x-wav, xm, mp3, opus, mp4, m4a
    @HasMimeType(audioMIMEType)
    audio: FileSystemStoredFile;
}
