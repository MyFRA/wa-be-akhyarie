import { Injectable } from '@nestjs/common';

@Injectable()
export class StringGeneratorService {
    getRandomString(length: number) {
        let result: String = '';
        const characters: String = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength: number = characters.length;
        let counter: number = 1 as number;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * parseInt(charactersLength.toString())));
            counter = (counter as number) + 1;
        }
        return result;
    }
}
