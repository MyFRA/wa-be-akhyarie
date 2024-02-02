import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenHelper } from 'src/helpers/token-helper/token.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private tokenHelper: TokenHelper) {}

    use(req: Request, res: Response, next: NextFunction) {
        // Token
        const authHeaders = req.headers.authorization;
        console.log('ok');

        if (authHeaders && (authHeaders as string).split(' ')[1]) {
            try {
                const token = (authHeaders as string).split(' ')[1];
                const decodedToken: any = this.tokenHelper.decode(token);
                if (decodedToken.expired_at < Math.floor(Date.now() / 1000)) {
                    return res.status(498).json({
                        code: 498,
                        msg: 'Your Token is Expired',
                    });
                }
            } catch (error) {
                return res.status(401).json({
                    code: 401,
                    msg: 'Your Token is Broken',
                });
            }
            next();
        } else {
            return res.status(401).json({
                code: 401,
                msg: 'Unauthorized',
            });
        }
    }
}
