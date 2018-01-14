import { Component } from '@nestjs/common';
import * as amqp from 'amqplib';

import * as Config from '../../../config/config';
import { connect } from 'net';
import { setTimeout } from 'timers';

@Component()
export class RabbitMessageQueue {
    private connection: amqp.Connection;
    private channel: amqp.Channel;
    constructor(private url: string, private exchange: string) { }

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