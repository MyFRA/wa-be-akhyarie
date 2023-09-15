import { HttpException } from '@nestjs/common';

export function errorHandler(statusCode: number, message: any) {
    throw new HttpException(
        {
            code: statusCode,
            msg: message,
        },
        statusCode,
    );
}
