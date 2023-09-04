import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateContactGroupHasContactDto {
    @IsNotEmpty()
    @IsUUID('all')
    contact_uuid: string;

    @IsNotEmpty()
    @IsUUID('all')
    contact_group_uuid: string;
}
