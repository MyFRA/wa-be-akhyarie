import { Global, Module } from '@nestjs/common';
import { TokenHelper } from './token.service';

@Global()
@Module({
    exports: [TokenHelper],
    providers: [TokenHelper],
})
export class TokenModule { }