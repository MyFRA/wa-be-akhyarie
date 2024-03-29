import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            // disableErrorMessages: true,
        }),
    );

    app.useStaticAssets(join(__dirname, '..', 'storage'), {
        prefix: '/storage',
    });

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    const optionsCors = {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
    };
    app.enableCors(optionsCors);

    await app.listen(5000);
}
bootstrap();
