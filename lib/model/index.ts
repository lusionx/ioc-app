import { provide, inject, init } from 'injection'
import { container } from '../glob'
import { Sequelize } from "sequelize"
import { AppConfig } from '../conf'
import * as m1 from './app-user'


@provide()
export class DbModel {
    @inject('appConfig')
    config: AppConfig

    public sequelize: Sequelize

    @init()
    async init() {
        this.sequelize = new Sequelize(this.config.dbConn)
        m1.init(this.sequelize)
    }
}
container.bind(DbModel)

export { AppUser } from './app-user'
