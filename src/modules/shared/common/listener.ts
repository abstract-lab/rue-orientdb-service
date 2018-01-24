export interface Listener {
    queueName: string;
    patternString: string;
    consumeMessage: boolean;
    onMessageReceived(msg: any): Promise<any>;
}