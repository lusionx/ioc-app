import { container } from '../lib/glob'
import { provide, init } from 'injection'
import * as fs from 'fs'

class ConfigItem {
    env: 'local' | 'test' | 'pord'
    domain: string
    port: number
    cemRoot: string
    /**
     * for log4js.configure
     */
    logger: any
    /**
     * for kue.createQueue
     */
    kue: any

    dbConn: string

    odata: {
        soc: string
    }
}

@provide()
export class AppConfig extends ConfigItem {
    @init()
    async init() {
        const env = process.env['NODE_ENV'] || 'local'
        const txt = await new Promise<string>((res, rej) => {
            fs.readFile(process.env['PWD'] + `/config/config.${env}.json`, { encoding: 'utf8' }, (err, data) => {
                err ? rej(err) : res(data)
            })
        })
        Object.assign(this, JSON.parse(txt))
    }
}
container.bind(AppConfig)
