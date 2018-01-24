import { Component } from '@nestjs/common';
import * as amqp from 'amqplib';

import * as Config from '../../../config/config';
import { Consumer } from '../../shared/common/consumer';
import { Listener } from '../../shared/common/listener';

@Component()
export class RabbitMessageQueue {
    private connection: amqp.Connection;
    private channel: amqp.Channel;
    private consumer: Consumer;

    constructor(private url: string, private exchange: string) { }

    public async acceptConsumer(consumer) {
        this.consumer = consumer;

        try {
            await this.initializeConnection();
        } catch (error) {
            
        }
    }

    public async sendMessage(routingKey: string, content: any, headers: {}): Promise<boolean> {
        let result = false;

        await this.initializeConnection();

        result = this.channel.publish(this.exchange, routingKey, new Buffer(JSON.stringify(content)), {
            headers: headers
        });

        return Promise.resolve(result);
    }

    private async ensureInfrastructure(): Promise<void> {
        await this.channel.assertExchange(this.exchange, 'topic')

        if(this.consumer && this.consumer.listeners && this.consumer.listeners.length > 0) {
            this.consumer.listeners.forEach(listener => this.ensureQueue(listener));
        }
    }

    private async ensureQueue(listener: Listener): Promise<boolean> {
        const queueAssert = await this.channel.assertQueue(listener.queueName);

        if(queueAssert.queue) {
            await this.channel.bindQueue(listener.queueName, this.exchange, listener.patternString);

            this.channel.consume(listener.queueName, (async(msg: amqp.Message | null) => {
                if(msg) {
                    const result = await listener.onMessageReceived(msg);
                    result ? this.channel.ack(msg): this.channel.nack(msg);
                }
            }))

            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }

    private async initializeConnection(): Promise<void> {
        let connectionAttempts: number = 1;
        let connected: boolean = false;

        while(!connected && connectionAttempts <= Config.Config.MQ_RETRY_POLICY.RETRY_COUNT) {
            try {
                this.connection = await amqp.connect(this.url);
                this.channel = await this.connection.createChannel();

                connected = true;
                console.log(`Successfully connected to url: ${this.url} after ${connectionAttempts} tries.`);
            } catch (error) {
                console.log(`Attempt #${connectionAttempts} failed (error: ${error}). Waiting another ${Config.Config.MQ_RETRY_POLICY.RETRY_TIMEOUT} seconds ...`);

                await this.wait(Number.parseInt(Config.Config.MQ_RETRY_POLICY.RETRY_TIMEOUT) * 1000);
                connectionAttempts ++;
            }
        }
    }

    private wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}