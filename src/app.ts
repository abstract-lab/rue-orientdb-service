import { NestFactory } from '@nestjs/core';

import { MainModule } from './modules/main.module';

async function bootstrap() {
    const port: number = Number.parseInt(<string>process.env.NODE_PORT) || 3001;
    const app = await NestFactory.create(MainModule);
    await app.listen(port);
    console.log(`OrientDb service listening on port ${port}`);
}

bootstrap();
