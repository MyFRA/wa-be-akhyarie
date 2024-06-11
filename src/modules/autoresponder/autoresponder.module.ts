import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AutoresponderController } from './autoresponder.controller';
import { AutoresponderService } from './autoresponder.service';
import { AuthMiddleware } from 'src/middleware';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
    controllers: [AutoresponderController],
    providers: [AutoresponderService],
    imports: [NestjsFormDataModule],
})
export class AutoresponderModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes({ path: 'api/autoresponders', method: RequestMethod.GET }, { path: 'api/autoresponders', method: RequestMethod.POST }, { path: 'api/autoresponders/:uuid', method: RequestMethod.GET }, { path: 'api/autoresponders/:uuid', method: RequestMethod.PATCH }, { path: 'api/autoresponders/:uuid', method: RequestMethod.DELETE });
    }
}
