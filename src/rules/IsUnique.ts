import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';

export type IsUniqeInterface = {
    tableName: string;
    column: string;
};

export function isUnique(options: IsUniqeInterface, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'isUnique',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: IsUniqueConstraint,
        });
    };
}

@ValidatorConstraint({ name: 'IsUniqueConstraint', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
    constructor(private readonly prismaService: PrismaService) {}
    async validate(value: string, args?: ValidationArguments): Promise<boolean> {
        // catch options from decorator
        const { tableName, column }: IsUniqeInterface = args.constraints[0];

        if (!value) {
            return false;
        }

        if (value.includes('"') || value.includes("'")) {
            return false;
        }

        const dataExist: Array<{}> = await this.prismaService.$queryRawUnsafe(`SELECT * FROM public."${tableName}" WHERE ${column} = '${value}'`);

        return dataExist.length == 0;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        // return custom field message
        const field: string = validationArguments.property;
        return `${field} is already exist`;
    }
}
