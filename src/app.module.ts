import { Module } from '@nestjs/common';
import { RequestContextModule } from 'nestjs-request-context';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { TokenModule } from './helpers/tokenHelper/token.module';
import { FileUploadModule } from './helpers/fileUploadHelper/file-upload.module';
import { GetCurrentUserModule } from './helpers/getCurrentUserHelper/getCurrentUser.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ContactModule } from './modules/contact/contact.module';
import { ContactGroupModule } from './modules/contact-group/contact-group.module';
import { ContactGroupHasContactModule } from './modules/contact-group-has-contact/contact-group-has-contact.module';
import { DeviceModule } from './modules/device/device.module';

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
  ],
})
export class AppModule { }
