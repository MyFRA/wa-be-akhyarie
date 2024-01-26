import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationOptions, registerDecorator } from 'class-validator';
import { UserService } from 'src/modules/user/user.service';

@ValidatorConstraint({ name: 'ResetPasswordTokenExists', async: true })
@Injectable()
export class ResetPasswordTokenExistsValidation implements ValidatorConstraintInterface {
    constructor(private usersService: UserService) {}

    async validate(value: string): Promise<boolean> {
        return this.usersService.findUserByResetPasswordToken(value).then((data) => {
            if (data !== null) {
                return true;
            } else {
                return false;
            }
        });
    }

    defaultMessage() {
        return `Reset password token is not valid or expired`;
    }
}
