import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MAIL_FROM_ADDRESS, WEB_FE_URL } from 'src/config';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendEmail(email: string, name: string, code: string) {
        await this.mailerService.sendMail({
            from: MAIL_FROM_ADDRESS,
            to: email,
            subject: '[Waresponder] Please verify your email',
            html: `
                <p>Hai ${name},</p>
                <p>
                    Terima kasih telah bergabung dengan Waresponder, kita perlu memastikan bahwa ini adalah alamat email Anda yang benar
                </p>
                <p>
                    
                ✨ Kode Verifikasi Anda: ${code} ✨
                </p>
                <p>
                Silakan gunakan kode ini untuk menyelesaikan proses registrasi Anda.
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

    async sendEmailForgotPassword(name: string, email: string, resetPasswordToken: string) {
        await this.mailerService.sendMail({
            from: MAIL_FROM_ADDRESS,
            to: email,
            subject: '[Waresponder] Reset Password',
            html: `
                <p>Hai ${name},</p>
                <p>
                    Kami menerima permintaan reset password untuk akun Anda. Untuk mengamankan akun dan mendapatkan akses kembali, silakan klik link di bawah ini:
                </p>
                <p>
                ✨ <a href="${WEB_FE_URL + '/auth/reset-password?token=' + resetPasswordToken}">Reset Password</a> ✨
                </p>
                <p>
                Pastikan untuk segera melakukan reset password setelah mengakses link tersebut. Jika Anda tidak melakukan permintaan ini, mohon abaikan pesan ini.
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
