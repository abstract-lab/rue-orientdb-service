import { Component } from '@nestjs/common';
import * as amqp from 'amqplib';

import { RabbitMessageQueue } from '../../messaging/components/rabbitmq.component';
import { OrientDbRepository } from '../../repository/components/orientdb.component';
import { Consumer } from '../../shared/common/consumer';
import { Listener } from '../../shared/common/listener';
import { InfoListener } from '../../shared/listeners/info.listener';
import { InfoPublisher } from '../../shared/listeners/info.publisher';
import { Publisher } from '../../shared/common/publisher';

@Component()
export class InfoService implements Consumer {
    listeners: Listener[] = [];
    publisher: Publisher;

    constructor(private mq: RabbitMessageQueue, private repository: OrientDbRepository) {
        this.initializeQueues();
        this.initializeConsumer();
    }

    private initializeQueues(): void {
        this.listeners.push(new InfoListener(this));
        this.publisher = new InfoPublisher(this.mq);
    }

    private async initializeConsumer(): Promise<void> {
        await this.mq.acceptConsumer(this);
    }

    async processMessage(msg: amqp.Message): Promise<any> {
        console.log(`Received message: ${JSON.stringify(msg)}`);
        const content: string[] = [];

        let response: amqp.Message = Object.assign({}, msg);

        const dbs = await this.repository.testDb();

        dbs.forEach((db: string) => {
            content.push(db);
        });

        response.content = new Buffer(JSON.stringify(content));

        return Promise.resolve(response);
    }

    async processResult(result: amqp.Message): Promise<boolean> {
        console.log(`Processing result: ${JSON.stringify(result)}`)
        return this.publisher.publishMessage(result)
    }
}