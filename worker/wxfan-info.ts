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
        const { wxProxy, odata } = this.app.service
        const ap = await odata.singleWxAccount(this.body.appid, [])
        if (!ap) return
        const resp = await wxProxy.userGet(ap.authorizer_access_token)
        if (resp.count && resp.data && resp.data.openid.length) {
            await this.saveRows(this.body.appid, ap.authorizer_access_token, resp.data.openid)
        }
    }

    async saveRows(appid: string, token: string, ids: string[]) {
        const SIZE = 100
        const { wxProxy } = this.app.service
        while (ids.length) {
            const hed = ids.slice(0, SIZE)
            ids = ids.slice(SIZE)
            const ulist = await wxProxy.userinfoBatch(token, hed)
            const qs = ulist.map((u) => WxUserinfo.create({ appid: appid, openid: u.openid, userinfo: u }))
            await Promise.all(qs)
        }
    }
}
container.bind(WxfanInfoWorker)
