import { IsNotEmpty, IsPhoneNumber, IsString, Matches } from "class-validator";

export class CreateDeviceDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    session_id: string;

    @IsNotEmpty()
    @IsString()
    api_key: string;
}
