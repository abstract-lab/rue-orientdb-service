import { Listener } from '../common/listener'
import { OrientDbRepository } from '../../repository/components/orientdb.component';

export class InfoListener implements Listener {
    readonly queueName: string = 'info';
    readonly patternString: string = '*.*.info';

    constructor(private repository: OrientDbRepository) { }
    async onMessageReceived(msg: any): Promise<boolean> {
        let result: boolean = false;

        if(msg) {
            const dbs = await this.repository.testDb();
            
            dbs.forEach(db => console.log(`Found: ${db} database`));
            result = true;
        }

        return Promise.resolve(result);
    }
}