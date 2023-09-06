import { IsNotEmpty, IsPhoneNumber, IsString, Matches } from "class-validator";

export class CreateContactDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty({ message: 'Phone number is required' })
    @Matches(/^\+62\d{9,13}$/, { message: 'Phone number must start with "+62", minimum 9 digits and maximum 13 digits.' })
    @IsPhoneNumber('ID', { message: 'Invalid phone number format' })
    phone_number?: string;
}
