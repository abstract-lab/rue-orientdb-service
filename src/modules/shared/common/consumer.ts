import { Listener } from './listener';
import { Publisher } from './publisher';

export interface Consumer {
    listeners: Listener[];
    publisher: Publisher;
}