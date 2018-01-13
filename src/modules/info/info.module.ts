import { Module } from '@nestjs/common';
import { RepositoryModule } from '../repository/repository.module';

@Module({
    modules: [
        RepositoryModule
    ]
})
export class InfoModule { }