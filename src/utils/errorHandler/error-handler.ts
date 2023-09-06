import { HttpException, HttpStatus } from '@nestjs/common';

export function errorHandler(statusCode: number, message: string) {
    throw new HttpException(
        {
            code: statusCode,
            msg: message,
        },
        statusCode,
    );
}
