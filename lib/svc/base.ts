import { provide, inject } from 'injection'
import { container } from '../glob'
import { HanderApp } from '../app'

/**
 * service 基类
 */

@provide()
export class BaseSvc {
    @inject('handerApp')
    app: HanderApp
}
container.bind(BaseSvc)
