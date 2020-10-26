import { provide } from 'injection';
import { BaseSvc } from '../svc/base';
import { WxUserinfo } from '../svc/wx-proxy';
import { doLimit, chunk } from '../tool';
import { container } from '../glob';

@provide()
export class WxApi extends BaseSvc {

    protected async cachedApp(appid: string) {
        const { redis, odata } = this.app.service
        return redis.cache('wxAccount.' + appid, 300, async () => await odata.singleWxAccount(appid, []), (e) => e)
    }

    async BatchOpenid(appid: string, next_openid?: string) {
        const { wxProxy, } = this.app.service
        const ap = await this.cachedApp(appid)
        if (!ap) throw new Error("Err40000MissWxAccount:" + appid);
        const resp = await wxProxy.userGet(ap.authorizer_access_token, next_openid)
        if (resp.errcode) {
            throw new Error(["Err", resp.errcode, 'userGet'].join('') + ":" + appid);
        }
        return resp
    }

    /**
     *
     * @param appid
     * @param openids 会拆成100个一组
     */
    async BatchUserInfo(appid: string, openids: string[]) {
        const { wxApi, } = this.app.service
        const ap = await this.cachedApp(appid)
        if (!ap) throw new Error("Err40000MissWxAccount:" + appid);
        const SIZE = 100
        const rr = chunk(openids, SIZE)
        const list: WxUserinfo[] = []
        const qs = rr.map(ids => {
            return async () => {
                const resp = await wxApi.BatchUserInfo(appid, ids)
                list.push(...resp)
            }
        })
        await doLimit(10, qs)
        return list
    }
}
container.bind(WxApi)
