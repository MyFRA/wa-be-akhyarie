import { Injectable } from "@nestjs/common";
import { TokenHelper } from "../token-helper/token.service";
import { FILE_URL } from "src/config";
import { errorHandler } from "src/utils/error-handler/error-handler";

@Injectable()
export class GetCurrentUserHelper {
    constructor(private tokenHelper: TokenHelper) { }
    async getCurrentUser(token: string, model: any) {
        try {
            const decodedToken = this.tokenHelper.decode(token.replace('Bearer ', ''));
            const uuid = decodedToken.uuid;

            const user = await model.findUnique({ where: { uuid } });

            delete user["password"];
            user["photo"] = user['photo'] ? FILE_URL + 'USERS/photo/' + user['photo'] : null

            return user;
        } catch (error) {
            errorHandler(401, "Invalid token!")
        }
    }
}