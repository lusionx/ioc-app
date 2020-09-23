import { provide, inject } from 'injection'
import { container } from '../glob'
import { RedisSvc } from './redis'

@provide()
export class AppService {
    @inject('redisSvc')
    redis: RedisSvc
}
container.bind(AppService)
