import { provide, inject } from 'injection'
import { container } from '../glob'
import { RedisSvc } from './redis'
import { CemApi } from '../cem'
import { ODataSvc } from './odata'

@provide()
export class AppService {
    @inject('redisSvc')
    redis: RedisSvc

    @inject('cemApi')
    cem: CemApi

    @inject('oDataSvc')
    odata: ODataSvc
}
container.bind(AppService)
