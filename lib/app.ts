import { provide, inject, init, scope, ScopeEnum } from 'injection'
import { getLogger, configure } from "log4js"
import { container } from './glob'
import { IncomingMessage, ServerResponse } from 'http'
import { sleep } from './tool'
import { createQueue, Queue } from 'kue'
import { AppService } from './svc'
import { AppConfig } from './conf'


@provide()
export class HanderApp {
    @inject('appConfig')
    config: AppConfig

    get reqHander() {
        return async (req: IncomingMessage, res: ServerResponse) => {
            const logger = getLogger()
            logger.debug('HanderApp', req.url)
            const ctx = await container.getAsync<AppCtx>(AppCtx)
            Object.assign(ctx, { req, res })
            ctx.doit().catch()
        }
    }

    get logger() {
        return getLogger()
    }

    @inject('appService')
    service: AppService

    queue: Queue

    @init()
    async init() {
        configure(this.config.logger)
        this.queue = createQueue(this.config.kue)
        this.logger.info('HanderApp @init')
        return await sleep(10)
    }

    regWorker(wtype: string, nw: number, ctx: AppCtx) {
        this.queue.process(wtype, nw, (job, cb) => {
            Object.assign(ctx, { job })
            ctx.doit().then(cb).catch(cb)
        })
    }
}
container.bind(HanderApp)


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

    async doit() {
        this.res.write('hello, ' + this.config.domain)
        this.res.end()
        const job = this.app.queue.createJob('dev', { url: this.req.url })
        await new Promise<void>(res => job.save(res))
        await this.app.service.redis.incr('dev')
        this.logger.debug(this.app.service.cem.singleCampaigns)
    }
}
container.bind(AppCtx)


export const diContianer = container
