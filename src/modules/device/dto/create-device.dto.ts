import { IsAlphanumeric, IsNotEmpty, IsPhoneNumber, IsString, Matches, NotContains } from 'class-validator';
import { isUnique } from 'src/rules/IsUnique';

export class CreateDeviceDto {
    @IsNotEmpty()
    @IsString()
    @IsAlphanumeric()
    @isUnique({ tableName: 'DEVICES', column: 'name' })
    name: string;
}
