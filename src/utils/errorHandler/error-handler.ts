import { HttpException, HttpStatus } from '@nestjs/common';

export function errorHandler(message: string) {
    throw new HttpException(
        {
            code: HttpStatus.UNPROCESSABLE_ENTITY,
            msg: message,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
    );
}
