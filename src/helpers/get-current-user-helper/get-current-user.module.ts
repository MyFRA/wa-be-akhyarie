import { Global, Module } from '@nestjs/common';
import { GetCurrentUserHelper } from './get-current-user.service';

@Global()
@Module({
    exports: [GetCurrentUserHelper],
    providers: [GetCurrentUserHelper],
})
export class GetCurrentUserModule { }