import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegistrationDto } from './dto';
import { Request, Response } from 'express';
import { FormDataRequest } from 'nestjs-form-data';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('registration')
    @FormDataRequest()
    async registration(@Body() registrationDto: RegistrationDto, @Res() res: Response) {
        await this.authService.registration(registrationDto);

        return res.status(200).json({
            code: 200,
            msg: 'You Have Successfully Registered',
        });
    }

    @Post('login')
    @FormDataRequest()
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        const token = await this.authService.login(loginDto);

        return res.status(200).json({
            code: 200,
            msg: 'You Have Successfully Login',
            data: token,
        });
    }

    @Get('user')
    async getCurrentUser(@Req() req: Request, @Res() res: Response) {
        const token = req.headers.authorization;
        const user = await this.authService.getCurrentUser(token);

        return res.status(200).json({
            code: 200,
            msg: 'Here is the User',
            data: user,
        });
    }

    @Post('verify-email')
    async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto, @Req() req: Request, @Res() res: Response) {
        const token = req.headers.authorization;
        const user = await this.authService.getCurrentUser(token);
        await this.authService.verifyEmail(verifyEmailDto, user);

        return res.status(200).json({
            code: 200,
            msg: 'Account successfully verified',
        });
    }
}
