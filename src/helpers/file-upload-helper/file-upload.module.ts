import { Global, Module } from '@nestjs/common';
import { FileUploadHelper } from './file-upload.service';


@Global()
@Module({
    exports: [FileUploadHelper],
    providers: [FileUploadHelper],
})
export class FileUploadModule {
}
