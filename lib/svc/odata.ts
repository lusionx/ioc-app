import { provide } from 'injection'
import { container } from '../glob'
import { BaseSvc } from './base'

const JWT = process.env["JWT"] || ''

export interface WeixinAccount {
    id: number
    component_appid: string
    authorizer_appid: string
    func_info: string
    authorizer_access_token: string
    authorizer_refresh_token?: string
    /** 服务号===2 */
    service_type_info: string
    verify_type_info: string
    nick_name: string
    user_name: string
    alias: string
    head_img: string
}

@provide()
export class ODataSvc extends BaseSvc {
    async singleWxAccount(authorizer_appid: string, funcs: number[]): Promise<WeixinAccount | undefined> {
        if (!authorizer_appid) return
        const { config } = this.app
        const params = {
            $filter: `authorizer_appid eq '${authorizer_appid}'`,
            $top: 9,
        }
        const headers = { Authorization: 'Bearer ' + JWT }
        const resp = await this.axios.get<{ value: WeixinAccount[] }>(config.odata.soc + '/weixinAccounts', { params, headers })
        let ls = resp.data.value
        if (ls.length === 0) return
        if (funcs.length === 0) return ls[ls.length - 1]
        const ss = funcs.map(e => e.toString())
        return ls.filter(e => {
            return ss.length === e.func_info.split(',').filter(i => ss.includes(i)).length
        })[0]
    }
}
container.bind(ODataSvc)
