import { Module } from '@nestjs/common';
import { Server } from 'orientjs';

import { Config } from '../../config/config';
import { OrientDbRepository } from './components/orientdb.component';

const server: Server = new Server({ host: Config.DB_HOST, port: Config.DB_PORT, username: Config.DB_USERNAME, password: Config.DB_PASSWORD });
const repository = new OrientDbRepository(server);

@Module({
    components: [
        { provide: OrientDbRepository, useValue: repository }
    ],
    exports: [
        OrientDbRepository
    ]
})
export class RepositoryModule { }