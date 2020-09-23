import { provide, inject } from 'injection'
import { container } from '../glob'
import { HanderApp } from '../app'

@provide()
export class BaseSvc {
    @inject('handerApp')
    app: HanderApp
}
container.bind(BaseSvc)
