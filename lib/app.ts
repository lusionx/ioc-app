import { provide, inject, init, scope, ScopeEnum, } from 'injection'
import { getLogger, configure } from "log4js"
import { container } from './glob'
import { IncomingMessage, ServerResponse } from 'http'
import { sleep, readStream } from './tool'
import { createQueue, Queue } from 'kue'
import { AppService } from './svc'
import { AppConfig } from './conf'
import { DbModel } from './model'


type getCtx = () => Promise<AppCtx>

@provide()
export class HanderApp {
    @inject('appConfig')
    config: AppConfig

    get reqHander() {
        return async (req: IncomingMessage, res: ServerResponse) => {
            const key = [req.method, req.url].join("")
            const qctx = this.tMap.get(key)
            if (!qctx) {
                res.statusCode = 404
                return res.end(key)
            }
            const ctx = await qctx()
            Object.assign(ctx, { req, res })
            try {
                await ctx.doit()
                res.statusCode = 200
                res.end()
            } catch (err) {
                this.saveError(key, err)
                res.statusCode = 500
                res.end(err.message)
            }
        }
    }

    saveError(key: string, err: Error) {
        const m = /^Err(\d+)(\w+):(.+)$/.exec(err.message);
        if (m) {
            const [, code, kind, msg] = m
            this.logger.error('%j', { key, code, kind, msg })
        } else {
            this.logger.error(key)
        }
        this.logger.error(err)
    }

    get logger() {
        return getLogger()
    }

    @inject('appService')
    service: AppService

    @inject('dbModel')
    dbs: DbModel

    queue: Queue

    @init()
    async init() {
        configure(this.config.logger)
        this.queue = createQueue(this.config.kue)
        this.logger.info('HanderApp @init')
        return await sleep(10)
    }

    protected tMap = new Map<string, getCtx>()

    regWorker(wtype: string, nw: number, p: getCtx) {
        this.tMap.set('POST/' + wtype, p)
        this.queue.process(wtype, nw, async (job, cb) => {
            const ctx = await p()
            Object.assign(ctx, { job })
            ctx.doit().then(cb).catch(cb)
        })
    }
}
container.bind(HanderApp)


/**
 * AppCtx msg处理ctx
 * 作用域ScopeEnum.Prototype, 子类继承
 *
 */
@scope(ScopeEnum.Prototype)
@provide()
export class AppCtx {
    @inject('handerApp')
    app: HanderApp

    @inject('appConfig')
    config: AppConfig

    get logger() {
        return getLogger('ctx')
    }

    req: IncomingMessage
    res: ServerResponse
    private _body: any
    get body() {
        return this._body
    }
    async doit() {
        if (!this.req) return
        const txt = await readStream(this.req)
        if (txt) {
            try {
                this._body = JSON.parse(txt)
            } catch (err) {
                this._body = {}
                this.logger.warn('ctx.body', txt)
            }
        }
    }
}
container.bind(AppCtx)


export const diContianer = container
