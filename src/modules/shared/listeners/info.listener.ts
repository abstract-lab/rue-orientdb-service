import { Listener } from '../common/listener'
import { OrientDbRepository } from '../../repository/components/orientdb.component';

export class InfoListener implements Listener {
    readonly queueName: string = 'info';
    readonly patternString: string = '*.*.info';

    constructor(private repository: OrientDbRepository) { }
    async onMessageReceived(msg: any): Promise<boolean> {
        let result: boolean = false;

        if(msg) {

        }

        return Promise.resolve(result);
    }
}