import { Server, Db, Record } from 'orientjs';
import { Component } from '@nestjs/common';

@Component()
export class OrientDbRepository {
    constructor(private server: Server) { }

    async testDb(): Promise<string[]> {
        return await this.server.list().map((db: Db) => { return db.name });
    }
}