import { provide, inject, init } from 'injection'
import { container } from '../glob'
import { Sequelize } from "sequelize"
import { AppConfig } from '../conf'
import * as m1 from './app-user'
import * as m2 from './user-log'


@provide()
export class DbModel {
    @inject('appConfig')
    config: AppConfig

    public sequelize: Sequelize

    @init()
    async init() {
        this.sequelize = new Sequelize(this.config.dbConn)
        const ll = [m1, m2]
        ll.forEach(m => m.init(this.sequelize))
    }
}
container.bind(DbModel)

export { AppUser } from './app-user'
export { UserLog } from './user-log'
