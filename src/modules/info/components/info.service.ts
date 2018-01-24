import { Component } from "@nestjs/common";
import { RabbitMessageQueue } from "../../messaging/components/rabbitmq.component";
import { OrientDbRepository } from "../../repository/components/orientdb.component";
import { Consumer } from "../../shared/common/consumer";
import { Listener } from "../../shared/common/listener";
import { InfoListener } from "../../shared/listeners/info.listener";

@Component()
export class InfoService implements Consumer {
    listeners: Listener[] = [];
    constructor(private mq: RabbitMessageQueue, private repository: OrientDbRepository) {
        this.initializeListener();
        this.initializeConsumer();
    }

    private initializeListener(): void {
        this.listeners.push(new InfoListener(this.repository));
    }

    private async initializeConsumer(): Promise<void> {
        await this.mq.acceptConsumer(this);
    }
}