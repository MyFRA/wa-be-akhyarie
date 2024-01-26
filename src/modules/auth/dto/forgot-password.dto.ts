import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';
import { EmailExistsValidation } from 'src/rules/EmailExists';

export class ForgotPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    @Validate(EmailExistsValidation)
    email: string;
}
