import { HttpException } from '@nestjs/common';

export function errorHandler(statusCode: number, message: string) {
    throw new HttpException(
        {
            code: statusCode,
            message: [message],
        },
        statusCode,
    );
}

export function errorHandlerNotThrow(statusCode: number, message: string) {
    return {
        code: statusCode,
        message: [message],
    };
}
