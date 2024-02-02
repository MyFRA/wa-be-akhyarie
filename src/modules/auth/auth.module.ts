import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AuthMiddleware } from 'src/middleware';
import { MailModule } from '../mail/mail.module';
import { StringGeneratorModule } from 'src/helpers/string-generator/string-generator.module';
import { EmailExistsValidation } from 'src/rules/EmailExists';
import { UserService } from '../user/user.service';
import { ResetPasswordTokenExistsValidation } from 'src/rules/ResetPasswordTokenExists';

@Module({
    controllers: [AuthController],
    providers: [AuthService, EmailExistsValidation, UserService, ResetPasswordTokenExistsValidation],
    imports: [NestjsFormDataModule, MailModule, StringGeneratorModule],
})
export class AuthModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(
            {
                path: '/api/auth/user',
                method: RequestMethod.GET,
            },
            {
                path: '/api/auth/dashboard',
                method: RequestMethod.GET,
            },
            {
                path: '/api/auth/verify-email',
                method: RequestMethod.POST,
            },
        );
    }
}
