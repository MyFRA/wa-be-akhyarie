import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { TokenHelper } from "../tokenHelper/token.service";
import { FILE_URL } from "src/config";

@Injectable()
export class GetCurrentUserHelper {
    constructor(private tokenHelper: TokenHelper) { }
    async getCurrentUser(token: string, model: any) {
        try {
            const decodedToken = this.tokenHelper.decode(token.replace('Bearer ', ''));
            const user_uuid = decodedToken.user_uuid;

            const user = await model.findUnique({
                where: {
                    uuid: user_uuid
                }
            });

            delete user["password"];
            user["photo"] = user['photo'] ? FILE_URL + 'user/' + user['photo'] : null

            return user;
        } catch (error) {
            throw new HttpException(
                {
                    code: HttpStatus.UNAUTHORIZED,
                    msg: "Invalid Token",
                },
                HttpStatus.UNAUTHORIZED,
            );
        }
    }
}