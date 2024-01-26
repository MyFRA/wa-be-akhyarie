import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationOptions, registerDecorator } from 'class-validator';
import { UserService } from 'src/modules/user/user.service';

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class EmailExistsValidation implements ValidatorConstraintInterface {
    constructor(private usersService: UserService) {}

    async validate(value: string): Promise<boolean> {
        return this.usersService.findUserByEmail(value).then((data) => {
            if (data !== null) {
                return true;
            } else {
                return false;
            }
        });
    }

    defaultMessage() {
        return `Email doesn't exists`;
    }
}
