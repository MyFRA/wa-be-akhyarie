import { IsOptional, IsUUID } from "class-validator";

export class UuidDto {
    @IsOptional()
    @IsUUID('all', { message: 'contact_group_uuid must be a UUID.' })
    except_contact_group_uuid?: string;
}
