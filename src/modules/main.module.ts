import { Module } from '@nestjs/common';
import { RepositoryModule } from './repository/repository.module';
import { MessagingModule } from './messaging/messaging.module';
import { InfoModule } from './info/info.module';

@Module({
    modules: [
        InfoModule,
        RepositoryModule,
        MessagingModule
    ]
})
export class MainModule { }