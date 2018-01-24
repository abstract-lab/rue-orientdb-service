import { Module } from '@nestjs/common';
import { RepositoryModule } from './repository/repository.module';
import { MessagingModule } from './messaging/messaging.module';
import { InfoModule } from './info/info.module';

@Module({
    modules: [
        RepositoryModule,
        MessagingModule,
        InfoModule
    ]
})
export class MainModule { }