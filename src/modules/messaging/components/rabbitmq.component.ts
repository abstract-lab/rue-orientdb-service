import { Component } from '@nestjs/common';
import * as amqp from 'amqplib';

import * as Config from '../../../config/config';
import { Consumer } from '../../shared/common/consumer';
import { Listener } from '../../shared/common/listener';
import { Publisher } from '../../shared/common/publisher';
import { Channel } from 'amqplib';

@Component()
export class RabbitMessageQueue {
    private connection: amqp.Connection;
    private consumer: Consumer;
    private channel: amqp.Channel;

    constructor(private url: string, private exchange: string) { }

    public async acceptConsumer(consumer:Consumer) {
        this.consumer = consumer;

        try {
            this.channel = await this.initializeConnection();
            await this.ensureInfrastructure(this.channel);
            await this.bindChannel(this.channel);
        } catch (error) {
            console.log(`Error initializing connection / ensuring infrastructure: ${error}`);
        }
    }

    public async sendMessage(routingKey: string, msg: amqp.Message): Promise<boolean> {
        let result = false;

        result = this.channel.publish(this.exchange, routingKey, msg.content, msg.properties);

        return Promise.resolve(result);
    }

    private async ensureInfrastructure(channel: amqp.Channel): Promise<boolean[]> {
        let promises: Promise<boolean>[] = [];

        await channel.assertExchange(this.exchange, 'topic')

        if(this.consumer) {
            if(this.consumer.listeners && this.consumer.listeners.length > 0) {
                this.consumer.listeners.map((listener: Listener) => {
                    promises.push(this.ensureQueue(listener, channel));
                });
            }

            if(this.consumer.publisher) {
                promises.push(this.ensureQueue(this.consumer.publisher, channel));
            };
        }

        return Promise.all<boolean>(promises);
    }

    private async ensureQueue(queue: Listener | Publisher, channel: amqp.Channel): Promise<boolean> {
        const queueAssert = await channel.assertQueue(queue.queueName);

        if(queueAssert.queue) {
            await channel.bindQueue(queue.queueName, this.exchange, queue.patternString);
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }

    private async bindChannel(channel: Channel): Promise<void> {
        this.consumer.listeners.forEach((listener: Listener) => {
            channel.consume(listener.queueName, (async(msg: amqp.Message | null) => {
                if(msg) {
                    const result = await listener.onMessageReceived(msg);

                    if (result && listener.consumeMessage) {
                        channel.ack(msg);
                    } else {
                        channel.nack(msg);
                    }
                }
            }))
        });
    }

    private async initializeConnection(): Promise<amqp.Channel> {
        let connectionAttempts: number = 1;
        let connected: boolean = false;

        while(!connected && connectionAttempts <= Config.Config.MQ_RETRY_POLICY.RETRY_COUNT) {
            try {
                this.connection = await amqp.connect(this.url);
                connected = true;
                console.log(`Successfully connected to url: ${this.url} after ${connectionAttempts} tries.`);

                return this.connection.createChannel();
            } catch (error) {
                console.log(`Attempt #${connectionAttempts} failed (error: ${error}). Waiting another ${Config.Config.MQ_RETRY_POLICY.RETRY_TIMEOUT} seconds ...`);

                await this.wait(Number.parseInt(Config.Config.MQ_RETRY_POLICY.RETRY_TIMEOUT) * 1000);
                connectionAttempts ++;
            }
        }

        return Promise.reject(null);
    }

    private wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}