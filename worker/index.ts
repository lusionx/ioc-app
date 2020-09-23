import { provide, } from 'injection'
import { BaseWorker } from './base'
import { container } from '../lib/glob'
import { sleep } from '../lib/tool'


interface JobData {
    url: string
}

@provide()
export class DevWorker extends BaseWorker<JobData> {
    async doit() {
        await super.doit()
        const data = this.body
        this.logger.info(data)
        await sleep(10)
    }
}
container.bind(DevWorker)
