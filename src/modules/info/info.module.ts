import { Module } from '@nestjs/common';
import { RepositoryModule } from '../repository/repository.module';
import { InfoService } from './components/info.service';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
    modules: [
        RepositoryModule,
        MessagingModule
    ],
    components: [
        InfoService
    ]
})
export class InfoModule { }