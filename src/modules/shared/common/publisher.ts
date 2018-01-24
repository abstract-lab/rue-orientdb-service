export abstract class Publisher {
    abstract queueName: string;
    abstract patternString: string;
    abstract async publishMessage(msg: any): Promise<any>;
}