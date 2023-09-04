import { IsNotEmpty, IsString } from "class-validator";

export class CreateDeviceDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}
