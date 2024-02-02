import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { AuthMiddleware } from 'src/middleware';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { IsUniqueConstraint } from 'src/rules/IsUnique';

@Module({
    controllers: [DeviceController],
    providers: [DeviceService, IsUniqueConstraint],
    imports: [NestjsFormDataModule],
    exports: [DeviceService],
})
export class DeviceModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes({ path: 'api/devices', method: RequestMethod.GET }, { path: 'api/devices', method: RequestMethod.POST }, { path: 'api/devices/:uuid', method: RequestMethod.GET }, { path: 'api/devices/:uuid', method: RequestMethod.PATCH }, { path: 'api/devices/:uuid', method: RequestMethod.DELETE });
    }
}
