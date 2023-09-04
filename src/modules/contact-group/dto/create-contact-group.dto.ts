import { IsNotEmpty, IsString } from "class-validator";

export class CreateContactGroupDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}
