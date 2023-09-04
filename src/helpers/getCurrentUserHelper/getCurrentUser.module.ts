import { Global, Module } from '@nestjs/common';
import { GetCurrentUserHelper } from './getCurrentUser.service';

@Global()
@Module({
    exports: [GetCurrentUserHelper],
    providers: [GetCurrentUserHelper],
})
export class GetCurrentUserModule { }