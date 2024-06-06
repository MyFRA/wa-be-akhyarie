import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MessageBroadcastService } from './message-broadcast.service';
import { MessageBroadcastController } from './message-broadcast.controller';
import { AuthMiddleware } from 'src/middleware';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { HttpModule } from '@nestjs/axios';

@Module({
    controllers: [MessageBroadcastController],
    providers: [MessageBroadcastService],
    imports: [
        NestjsFormDataModule,
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
    ],
})
export class MessageBroadcastModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes({ path: 'api/send-broadcast-messages/text', method: RequestMethod.POST });
    }
}
