import { IsNotEmpty, IsString, Length, Matches, Validate } from 'class-validator';
import { Match } from 'src/rules/Match';
import { ResetPasswordTokenExistsValidation } from 'src/rules/ResetPasswordTokenExists';

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsString()
    @Validate(ResetPasswordTokenExistsValidation)
    token: string;

    @IsString()
    @IsNotEmpty()
    @Length(8)
    password: string;

    @Match('password')
    password_confirmation: string;
}
