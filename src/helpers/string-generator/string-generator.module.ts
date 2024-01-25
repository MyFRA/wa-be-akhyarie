import { Module } from '@nestjs/common';
import { StringGeneratorService } from './string-generator.service';

@Module({
    providers: [StringGeneratorService],
    exports: [StringGeneratorService],
})
export class StringGeneratorModule {}
