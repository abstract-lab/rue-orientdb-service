import { Server, Record } from 'orientjs';
import { Component } from '@nestjs/common';

@Component()
export class OrientDbRepository {
    constructor(private server: Server) { }
}