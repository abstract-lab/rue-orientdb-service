import { Module } from '@nestjs/common';

import { Config } from '../../config/config';
import { RabbitMessageQueue } from './components/rabbitmq.component';

const rabbitMQ: RabbitMessageQueue = new RabbitMessageQueue(Config.getMQHost(), Config.getExchangeName());

@Module({
    components: [{
        provide: RabbitMessageQueue, useValue: rabbitMQ
    }],
    exports: [ RabbitMessageQueue ]
})
export class MessagingModule { }