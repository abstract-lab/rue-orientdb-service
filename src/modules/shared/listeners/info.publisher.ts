import * as amqp from 'amqplib';

import { Publisher } from '../common/publisher'
import { OrientDbRepository } from '../../repository/components/orientdb.component';
import { RabbitMessageQueue } from '../../messaging/components/rabbitmq.component';
import { InfoService } from '../../info/components/info.service';

export class InfoPublisher implements Publisher {
    readonly queueName: string = 'info-response';
    readonly patternString: string = 'response.info.db';

    constructor(private mq: RabbitMessageQueue) { }

    async publishMessage(response: amqp.Message): Promise<boolean> {
        return this.mq.sendMessage(this.patternString, response);
    }
}