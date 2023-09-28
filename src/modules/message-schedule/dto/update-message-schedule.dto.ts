import { PartialType } from '@nestjs/swagger';
import { CreateMessageScheduleDto } from './create-message-schedule.dto';
import { IsOptional } from 'class-validator';
import { FileSystemStoredFile } from 'nestjs-form-data';

export class UpdateMessageScheduleDto extends PartialType(CreateMessageScheduleDto) {
    @IsOptional()
    message: string | FileSystemStoredFile;
}
