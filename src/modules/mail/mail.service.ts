import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {

    constructor(private mailerService: MailerService) {}

    async sendEmail(email: string, name: string, code: string) {
        const bodyEmail = 'Haloo, ini contoh kirim email';
    
        await this.mailerService.sendMail({
            from: 'tomyntapss@gmail.com',
            to: email,
            subject: '[Waresponder] Please verify your email',
            text: bodyEmail,
            html: `
                <p>Hai ${name},</p>
                <p>
                    Terima kasih telah bergabung dengan Waresponder, kita perlu memastikan bahwa ini adalah alamat email Anda yang benar
                </p>
                <p>
                    
                ✨ Kode Verifikasi Anda: ${code} ✨
                </p>
                <p>
                Silakan gunakan kode ini untuk menyelesaikan proses registrasi Anda. .
                </p>

                <p>
                Terima kasih,
                </p>
                <p style="margin-top: -0.75rem">
                Tim Waresponder
                </p>
            `,
        });
    }
}
