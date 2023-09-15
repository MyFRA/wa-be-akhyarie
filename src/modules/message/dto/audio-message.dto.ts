import { IsNotEmpty, IsUUID } from "class-validator";
import { FileSystemStoredFile, HasMimeType, IsFile, MaxFileSize } from "nestjs-form-data";

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
    @HasMimeType([
        'audio/mpeg',
        'audio/ogg',
        'audio/wav',
        'audio/webm',
        'audio/3gpp',
        'audio/3gpp2',
        'audio/aac',
        'audio/mp4',
        'audio/midi',
        'audio/x-midi',
        'audio/x-mpegurl',
        'audio/x-ms-wma',
        'audio/x-wav',
        'audio/x-ms-wax',
        'audio/x-pn-realaudio',
        'audio/x-pn-realaudio-plugin',
        'audio/x-realaudio',
        'audio/x-pn-aiff',
        'audio/x-pn-au',
        'audio/x-pn-wav',
        'audio/x-pn-windows-acm',
        'audio/x-real-audio',
        'audio/x-scpls',
        'audio/x-wav',
        'audio/xm',
        'audio/mp3',
        'audio/opus',
        'audio/mp4',
        'audio/m4a',
    ])
    audio: FileSystemStoredFile;
}
