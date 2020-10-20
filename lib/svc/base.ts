import { provide, inject } from 'injection'
import { container } from '../glob'
import { HanderApp } from '../app'
import axios from 'axios'


/**
 * service 基类
 */

@provide()
export class BaseSvc {
    @inject('handerApp')
    app: HanderApp

    get axios() {
        return axios.create()
    }
}
container.bind(BaseSvc)
