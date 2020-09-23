import { container } from '../lib/glob'
import { provide, init } from 'injection'
import * as fs from 'fs'
import { dirname } from 'path'

@provide()
export class AppConfig {
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

    @init()
    async init() {
        const env = process.env['NODE_ENV'] || 'local'
        const txt = await new Promise<string>((res, rej) => {
            fs.readFile(dirname(__filename) + `/config.${env}.json`, { encoding: 'utf8' }, (err, data) => {
                err ? rej(err) : res(data)
            })
        })
        Object.assign(this, JSON.parse(txt))
    }
}
container.bind(AppConfig)
