import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenHelper } from 'src/helpers/tokenHelper/token.service';

@Injectable()
export class AuthAdminMiddleware implements NestMiddleware {

    constructor(private tokenHelper: TokenHelper) { }

    use(req: Request, res: Response, next: NextFunction) {
        // Token
        const authHeaders = req.headers.authorization;

        try {
            const token = (authHeaders as string).split(' ')[1];
            const decodedToken: any = this.tokenHelper.decode(token);
            if (decodedToken.status !== "admin") {
                return res.status(403).json({
                    code: 403,
                    msg: 'Unauthorized',
                });
            }
        } catch (error) {
            return res.status(401).json({
                code: 401,
                msg: 'Your Token is Broken',
            });
        }
        next();
    }
}
