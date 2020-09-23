import { provide, inject } from 'injection'
import { container } from '../glob'
import { RedisSvc } from './redis'
import { CemApi } from '../cem'

@provide()
export class AppService {
    @inject('redisSvc')
    redis: RedisSvc

    @inject('cemApi')
    cem: CemApi
}
container.bind(AppService)
