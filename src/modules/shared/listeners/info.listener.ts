import { Listener } from '../common/listener'
import { Consumer } from '../common/consumer';
import { OrientDbRepository } from '../../repository/components/orientdb.component';
import { RabbitMessageQueue } from '../../messaging/components/rabbitmq.component';
import { InfoService } from '../../info/components/info.service';

export class InfoListener implements Listener {

    readonly queueName: string = 'info-request';
    readonly patternString: string = 'request.info.*';
    readonly consumeMessage: boolean = true;
    constructor(private consumer: InfoService) { }

    async onMessageReceived(msg: any): Promise<any> {
        const result = await this.consumer.processMessage(msg);

        return await this.consumer.processResult(result);
    }
}