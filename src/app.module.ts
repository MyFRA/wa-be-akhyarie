import { Module } from '@nestjs/common';
import { RequestContextModule } from 'nestjs-request-context';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { TokenModule } from './helpers/token-helper/token.module';
import { FileUploadModule } from './helpers/file-upload-helper/file-upload.module';
import { GetCurrentUserModule } from './helpers/get-current-user-helper/get-current-user.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ContactModule } from './modules/contact/contact.module';
import { ContactGroupModule } from './modules/contact-group/contact-group.module';
import { ContactGroupHasContactModule } from './modules/contact-group-has-contact/contact-group-has-contact.module';
import { DeviceModule } from './modules/device/device.module';
import { MessageModule } from './modules/message/message.module';
import { ValidatorModule } from './helpers/validator-helper/validator.module';
import { MessageBroadcastModule } from './modules/message-broadcast/message-broadcast.module';
import { MessageScheduleModule } from './modules/message-schedule/message-schedule.module';
import { MailModule } from './modules/mail/mail.module';
import { StringGeneratorModule } from './helpers/string-generator/string-generator.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
    PrismaModule,
    RequestContextModule,
    FileUploadModule,
    TokenModule,
    GetCurrentUserModule,
    AuthModule,
    UserModule,
    ContactModule,
    ContactGroupModule,
    ContactGroupHasContactModule,
    DeviceModule,
    MessageModule,
    MessageBroadcastModule,
    ValidatorModule,
    MessageScheduleModule,
    MailModule,
    StringGeneratorModule,
  ],
})
export class AppModule { }
