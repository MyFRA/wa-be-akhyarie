import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AuthMiddleware } from 'src/middleware/auth.middleware';
import { MailModule } from '../mail/mail.module';
import { StringGeneratorModule } from 'src/helpers/string-generator/string-generator.module';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [NestjsFormDataModule, MailModule, StringGeneratorModule],
})
export class AuthModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(
            {
                path: 'auth/user',
                method: RequestMethod.GET,
            },
            {
                path: 'auth/dashboard',
                method: RequestMethod.GET,
            },
            {
                path: 'auth/verify-email',
                method: RequestMethod.POST,
            },
        );
    }
}
