import { provide, inject, init } from 'injection'
import { container } from '../glob'
import { Sequelize } from "sequelize"
import { AppConfig } from '../conf'
import * as m1 from './app-user'
import * as m2 from './user-log'
import * as m3 from './wx-userinfo'


@provide()
export class DbModel {
    @inject('appConfig')
    config: AppConfig

    public sequelize: Sequelize

    @init()
    async init() {
        this.sequelize = new Sequelize(this.config.dbConn)
        const ll = [m1, m2, m3]
        ll.forEach(m => m.init(this.sequelize))

        m1.AppUser.hasMany(m2.UserLog, {
            foreignKey: 'userId',
            as: 'logs',
        })
        m2.UserLog.belongsTo(m1.AppUser, {
            as: 'user'
        })
    }
}
container.bind(DbModel)

export { AppUser } from './app-user'
export { UserLog } from './user-log'
