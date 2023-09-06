import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { LoginDto, RegistrationDto } from "./dto";
import * as bcrypt from "bcrypt";
import { TokenHelper } from "src/helpers/tokenHelper/token.service";
import { GetCurrentUserHelper } from "src/helpers/getCurrentUserHelper/getCurrentUser.service";
import { errorHandler } from "src/utils/errorHandler/error-handler";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private tokenHelper: TokenHelper, private getCurrentUserHelper: GetCurrentUserHelper) { }

    async registration(registrationDto: RegistrationDto) {
        // Cek duplicate Email
        const user_email = await this.findUserByEmail(registrationDto.email);

        if (user_email) {
            errorHandler(422, "You Failed to Register! Email already in use.")
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
            errorHandler(422, "Error! Please Contact Admin.")
        }
    }

    async login(loginDto: LoginDto) {

        // find the user by email
        const user =
            await this.findUserByEmail(loginDto.email);

        // if user does not exist throw exception
        if (!user) {
            errorHandler(422, "Email or password is wrong.")
        }

        // compare password
        const pwMatches = await bcrypt.compare(
            loginDto.password,
            user.password.replace('$2y$', '$2a$'),
        );

        // if password incorrect throw exception
        if (!pwMatches) {
            errorHandler(422, "Email or password is wrong.")
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
            errorHandler(401, "Invalid Token!")
        }
    }

    async findUserByEmail(email: string) {
        return await this.prisma.uSERS.findUnique({ where: { email } })
    }
}