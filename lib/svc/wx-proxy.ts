import { provide } from 'injection'
import { container } from '../glob'
import { BaseSvc } from './base'
import * as util from 'util'

const ROOT = 'https://api.weixin.qq.com/cgi-bin'

type SUBSCRIBE_SCENE = 'ADD_SCENE_SEARCH' | 'ADD_SCENE_ACCOUNT_MIGRATION' | 'ADD_SCENE_PROFILE_CARD' | 'ADD_SCENE_QR_CODE' | 'ADD_SCENEPROFILE' | 'ADD_SCENE_PROFILE_ITEM' | 'ADD_SCENE_PAID' | 'ADD_SCENE_OTHERS'
export interface WxUserinfo {
    /** 0:未关注; 1:关注 */
    subscribe: number
    openid: string
    nickname: string
    sex: number
    language: string
    city: string
    province: string
    country: string
    headimgurl: string
    subscribe_time: number
    unionid?: string
    remark: string
    groupid: number
    tagid_list: number[]
    /** 头像的/64 buf sha1 */
    sha1?: string
    subscribe_scene: SUBSCRIBE_SCENE
    qr_scene: number
    qr_scene_str: string
}

const REG_FIX = /[\u0001-\u0007\u000b\u000e-\u0016\u0018\u0019\u001a-\u001e]+/g

@provide()
export class WxProxySvc extends BaseSvc {
    /**
     * 粉丝openid列表 func_info(2)
     */
    async userGet(access_token: string, next_openid?: string) {
        let resp = await this.axios.get(`${ROOT}/user/get`, { params: { access_token, next_openid } })
        return resp.data as {
            total: number
            count: number
            data?: { openid: string[] }
            next_openid: string
        }
    }
    /**
     * 批量获取userinfo func_info(2)
     * @param openids 最多100条
     */
    async userinfoBatch(access_token: string, openids: string[]): Promise<WxUserinfo[]> {
        let user_list = openids.map((e) => { return { openid: e } })
        let { data } = await this.axios.post(`${ROOT}/user/info/batchget`, { user_list }, { params: { access_token } })
        if (util.isString(data)) {
            return JSON.parse(data.replace(REG_FIX, '')).user_info_list
        }
        return data.user_info_list as WxUserinfo[]
    }
}
container.bind(WxProxySvc)
