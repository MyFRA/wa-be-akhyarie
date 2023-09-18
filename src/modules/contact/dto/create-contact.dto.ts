import { IsNotEmpty, IsPhoneNumber, IsString, Matches } from "class-validator";

export class CreateContactDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @Matches(/^\d{8,16}$/, { message: 'Phone number must have a minimum of 8 digits and maximum 16 digits.' })
    // @IsPhoneNumber('ID', { message: 'Invalid phone number format' })
    phone_number: string;
}
