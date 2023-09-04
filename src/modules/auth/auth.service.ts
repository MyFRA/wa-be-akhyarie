import { HttpException, HttpStatus, Injectable, Req } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { LoginDto, RegistrationDto } from "./dto";
import * as bcrypt from "bcrypt";
import { TokenHelper } from "src/helpers/tokenHelper/token.service";
import { GetCurrentUserHelper } from "src/helpers/getCurrentUserHelper/getCurrentUser.service";
import { Request } from "express";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private tokenHelper: TokenHelper, private getCurrentUserHelper: GetCurrentUserHelper) { }

    async registration(registrationDto: RegistrationDto) {
        // Cek duplicate Email
        const user_email = await this.findUserByEmail(registrationDto.email);

        if (user_email) {
            throw new HttpException(
                {
                    code: HttpStatus.UNPROCESSABLE_ENTITY,
                    msg: 'You Failed to Register! Email already in use.',
                },
                HttpStatus.UNPROCESSABLE_ENTITY,
            );
        }

        try {
            const createUser = await this.prisma.uSERS.create({
                data: {
                    name: registrationDto.name,
                    email: registrationDto.email,
                    password: await bcrypt.hash(registrationDto.password, 10),
                    expired_at: new Date(),
                    status: "user",
                }
            });

            return createUser;

        } catch (error) {
            throw new HttpException(
                {
                    code: HttpStatus.UNPROCESSABLE_ENTITY,
                    msg: "Error! Please Contact Admin.",
                },
                HttpStatus.UNPROCESSABLE_ENTITY,
            );
        }
    }

    async login(loginDto: LoginDto) {

        // find the user by email
        const user =
            await this.findUserByEmail(loginDto.email);

        // if user does not exist throw exception
        if (!user)
            throw new HttpException(
                {
                    code: HttpStatus.UNPROCESSABLE_ENTITY,
                    msg: 'Email or Password is Wrong',
                },
                HttpStatus.UNPROCESSABLE_ENTITY,
            );

        // compare password
        const pwMatches = await bcrypt.compare(
            loginDto.password,
            user.password.replace('$2y$', '$2a$'),
        );

        // if password incorrect throw exception
        if (!pwMatches)
            throw new HttpException(
                {
                    code: HttpStatus.UNPROCESSABLE_ENTITY,
                    msg: 'Email or Password is Wrong',
                },
                HttpStatus.UNPROCESSABLE_ENTITY,
            );

        // Generate Token
        const token = this.tokenHelper.encode(user.uuid, user.email, user.name, user.status);

        return token;
    }

    async getCurrentUser(@Req() req: Request) {
        try {
            // Get Current User
            const user = await this.getCurrentUserHelper.getCurrentUser(req.headers.authorization, this.prisma.uSERS);

            return user;

        } catch (error) {
            console.log(error)
            throw new HttpException(
                {
                    code: HttpStatus.UNAUTHORIZED,
                    msg: 'Invalid Token',
                },
                HttpStatus.UNAUTHORIZED,
            );
        }
    }

    async findUserByEmail(email: string) {
        return await this.prisma.uSERS.findUnique({ where: { email } })
    }
}