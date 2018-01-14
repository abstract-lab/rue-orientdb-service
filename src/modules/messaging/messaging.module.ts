import { Module } from '@nestjs/common';
import { Config } from '../../config/config';

const rabbitMQ: MessageQueue

@Module({
    components: [
        { provide: OrientDbRepository, useValue: repository }
    ],
    exports: [
        OrientDbRepository
    ]
})
export class MessagingModule { }