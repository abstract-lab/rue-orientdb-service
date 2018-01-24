export class Config {
    private static readonly DEVELOPMENT_ENV = process.env.NODE_ENV === 'development';
    private static readonly DEFAULT_MQ_HOST: string = 'localhost';
    private static readonly DEFAULT_MQ_PORT: number = 5672;
    private static readonly DEFAULT_MQ_USERNAME: string = 'admin';
    private static readonly DEFAULT_MQ_PASSWORD: string = 'abcd1234&';
    public static readonly DEFAULT_EXCHANGE_NAME: string = 'rue-auth-exch';
    public static readonly MQ_RETRY_POLICY: any = {
        RETRY_COUNT: 10,
        RETRY_TIMEOUT: 5
    };

    public static getMQHost(): string {
        return `amqp://${process.env.MQ_USERNAME || Config.DEFAULT_MQ_USERNAME}:${process.env.MQ_PASSWORD || Config.DEFAULT_MQ_PASSWORD}@${process.env.MQ_HOST || Config.DEFAULT_MQ_HOST}:${process.env.MQ_PORT || Config.DEFAULT_MQ_PORT}`;
    }

    public static getExchangeName(): string {
        return process.env.MQ_EXCHANGE_NAME || Config.DEFAULT_EXCHANGE_NAME;
    }

    public static readonly DB_HOST: string = process.env.DB_HOST || 'localhost';
    public static readonly DB_PORT: number = Number.parseInt(<string>process.env.DB_PORT) || 2424;
    public static readonly DB_USERNAME: string = process.env.DB_USERNAME || 'root';
    public static readonly DB_PASSWORD: string = process.env.DB_PASSWORD || 'abcd1234&';
}