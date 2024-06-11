import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Matches, MinLength, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';
import { FileSystemStoredFile, HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';

@ValidatorConstraint({ name: 'passwordMatch', async: false })
export class PasswordMatchConstraint implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments) {
        const password = (args.object as any).password; // Mendapatkan nilai dari properti "password" di DTO
        const confirmPassword = value;

        if (!password && !confirmPassword) {
            return true;
        }

        return password === confirmPassword;
    }

    defaultMessage(args: ValidationArguments) {
        return `Passwords do not match.`;
    }
}

function ValidatePasswordConfirmation(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'validatePasswordConfirmation',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: PasswordMatchConstraint,
        });
    };
}

export class UpdateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string;

    @IsOptional()
    @IsString()
    @ValidatePasswordConfirmation()
    password_confirmation?: string;

    @IsNotEmpty({ message: 'Phone number is required' })
    @Matches(/^\d{8,16}$/, { message: 'Phone number must have a minimum of 8 digits and maximum 16 digits.' })
    // @IsPhoneNumber('ID', { message: 'Invalid phone number format' })
    phone_number: string;

    @IsOptional()
    @IsFile()
    @MaxFileSize(1e6)
    @HasMimeType(['image/jpeg', 'image/png', 'image/jpg'])
    photo?: FileSystemStoredFile;
}
