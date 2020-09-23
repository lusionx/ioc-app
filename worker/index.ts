import { provide, } from 'injection'
import { BaseWorker } from './base'
import { container } from '../lib/glob'


interface JobData {
    url: string
}

@provide()
export class DevWorker extends BaseWorker<JobData> {
    async doit() {
        this.logger.info(this.job.data)
    }
}
container.bind(DevWorker)
