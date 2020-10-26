import { provide, inject } from 'injection'
import { container } from '../glob'
import { RedisSvc } from './redis'
import { CemApi, WxApi } from '../cem'
import { ODataSvc } from './odata'
import { WxProxySvc } from './wx-proxy'

@provide()
export class AppService {
    @inject('redisSvc')
    redis: RedisSvc

    @inject('cemApi')
    cemApi: CemApi

    @inject('wxApi')
    wxApi: WxApi

    @inject('oDataSvc')
    odata: ODataSvc

    @inject('wxProxySvc')
    wxProxy: WxProxySvc
}
container.bind(AppService)
