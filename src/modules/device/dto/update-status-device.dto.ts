import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class UpdateStatusDeviceDto {
    @IsNotEmpty()
    @IsString()
    @IsEnum(['connected', 'disconnected'], { message: 'status must be one of the following values: connected, disconnected' })
    status: string;

    @IsOptional()
    @Matches(/^\d{8,16}$/, { message: 'Phone number must have a minimum of 8 digits and maximum 16 digits.' })
    phone_number: string;

    @IsOptional()
    @IsString()
    session_id: string;

    @IsOptional()
    @IsString()
    api_key: string;
}
