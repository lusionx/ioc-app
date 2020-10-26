import { provide, } from 'injection'
import { BaseWorker } from './base'
import { container } from '../lib/glob'
import { WxUserinfo } from '../lib/model'


interface JobData {
    appid: string
}

@provide()
export class WxfanInfoWorker extends BaseWorker<JobData> {
    async doit() {
        await super.doit()
        this.logger.info(this.body)
        const { wxApi } = this.app.service
        const resp = await wxApi.BatchOpenid(this.body.appid)
        if (resp.count && resp.data && resp.data.openid.length) {
            await this.saveRows(this.body.appid, resp.data.openid)
        }
    }

    async saveRows(appid: string, ids: string[]) {
        const { wxApi } = this.app.service
        const ulist = await wxApi.BatchUserInfo(appid, ids)
        const qs = ulist.map((u) => WxUserinfo.create({ appid: appid, openid: u.openid, userinfo: u }))
        await Promise.all(qs)
    }
}
container.bind(WxfanInfoWorker)
