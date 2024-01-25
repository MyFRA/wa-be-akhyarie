import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
              host: 'smtp.gmail.com',
              port: 465,
              auth: {
                user: "tomyntapss@gmail.com",
                pass: 'vubhrnuowrhwtnoy',
              },
              tls: {
                rejectUnauthorized: false,
              },
            },
          }),
    ],
    providers: [MailService],
    controllers: [MailController],
    exports: [MailService]
})
export class MailModule {}
