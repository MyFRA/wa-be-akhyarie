import { Global, Module } from '@nestjs/common';
import { validatorHelper } from './validator.service';
import { ContactModule } from 'src/modules/contact/contact.module';
import { ContactGroupModule } from 'src/modules/contact-group/contact-group.module';
import { DeviceModule } from 'src/modules/device/device.module';

@Global()
@Module({
    exports: [validatorHelper],
    providers: [validatorHelper],
    imports: [ContactModule, ContactGroupModule, DeviceModule],
})
export class ValidatorModule {}
