import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegistrationDto } from './dto';
import * as bcrypt from 'bcrypt';
import { TokenHelper } from 'src/helpers/token-helper/token.service';
import { errorHandler } from 'src/utils/error-handler/error-handler';
import { GetCurrentUserHelper } from 'src/helpers/get-current-user-helper/get-current-user.service';
import { MailService } from '../mail/mail.service';
import { StringGeneratorService } from 'src/helpers/string-generator/string-generator.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { USERS } from '@prisma/client';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private tokenHelper: TokenHelper, private getCurrentUserHelper: GetCurrentUserHelper, private mailService: MailService, private stringGenerator: StringGeneratorService) {}

    async registration(registrationDto: RegistrationDto) {
        // Cek duplicate Email
        const user_email = await this.findUserByEmail(registrationDto.email);

        if (user_email) {
            errorHandler(400, 'You Failed to Register! Email already in use.');
        }

        try {
            const createUser = await this.prisma.uSERS.create({
                data: {
                    name: registrationDto.name,
                    email: registrationDto.email,
                    password: await bcrypt.hash(registrationDto.password, 10),
                    expired_at: new Date(),
                    status: 'user',
                    token_code: this.stringGenerator.getRandomString(10).toString(),
                },
            });

            this.mailService.sendEmail(createUser.email, createUser.name, createUser.token_code);

            const token = this.tokenHelper.encode(createUser.uuid, createUser.email, createUser.name, createUser.status);

            return token;
        } catch (error) {
            errorHandler(400, 'Error! Please contact the administrator.');
        }
    }

    async login(loginDto: LoginDto) {
        // find the user by email
        const user = await this.findUserByEmail(loginDto.email);

        // if user does not exist throw exception
        if (!user) {
            errorHandler(400, 'Email or password is wrong.');
        }

        // compare password
        const pwMatches = await bcrypt.compare(loginDto.password, user.password.replace('$2y$', '$2a$'));

        // if password incorrect throw exception
        if (!pwMatches) {
            errorHandler(400, 'Email or password is wrong.');
        }
        // Generate Token
        const token = this.tokenHelper.encode(user.uuid, user.email, user.name, user.status);

        return token;
    }

    async getCurrentUser(token: string) {
        try {
            // Get Current User
            const user = await this.getCurrentUserHelper.getCurrentUser(token, this.prisma.uSERS);

            return user;
        } catch (error) {
            errorHandler(401, 'Invalid Token!');
        }
    }

    async findUserByEmail(email: string) {
        return await this.prisma.uSERS.findUnique({ where: { email } });
    }

    async verifyEmail(verifyEmailDto: VerifyEmailDto, user: USERS) {
        if (user.email_verified_at) {
            errorHandler(400, 'User account has been verified');
        }

        if (user.token_code != verifyEmailDto.code) {
            errorHandler(400, 'Code is not valid');
        }

        await this.prisma.uSERS.update({
            where: {
                email: user.email,
            },
            data: {
                email_verified_at: new Date(),
            },
        });

        return user;
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        await this.prisma.uSERS.update({
            where: {
                email: forgotPasswordDto.email,
            },
            data: {
                reset_password_token: this.stringGenerator.getRandomString(10).toString(),
            },
        });

        const user = await this.findUserByEmail(forgotPasswordDto.email);

        this.mailService.sendEmailForgotPassword(user.name, user.email, user.reset_password_token);
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        await this.prisma.uSERS.updateMany({
            data: {
                password: await bcrypt.hash(resetPasswordDto.password, 10),
                reset_password_token: null,
            },
            where: {
                reset_password_token: resetPasswordDto.token,
            },
        });
    }
}
