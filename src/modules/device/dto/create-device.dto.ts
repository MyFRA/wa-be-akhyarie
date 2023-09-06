import { IsNotEmpty, IsString } from "class-validator";

export class CreateDeviceDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    session_id?: string;

    @IsString()
    api_key?: string;
}
