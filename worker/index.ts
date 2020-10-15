import { provide, } from 'injection'
import { BaseWorker } from './base'
import { container } from '../lib/glob'
import { sleep } from '../lib/tool'
import { AppUser, UserLog } from '../lib/model'


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
        const uu = await AppUser.create({ name: 'dwxx', preferredName: 'lxing' })
        const ulog = await UserLog.create({ message: 'msg', userId: uu.id })
        this.logger.info(ulog.toJSON())
    }
}
container.bind(DevWorker)
