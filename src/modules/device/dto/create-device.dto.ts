import { IsNotEmpty, IsPhoneNumber, IsString, Matches } from "class-validator";

export class CreateDeviceDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}
