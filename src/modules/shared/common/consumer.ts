import { Listener } from './listener';

export interface Consumer {
    listeners: Listener[];
}