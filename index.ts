import { HanderApp, diContianer as container } from './lib/app'
import { createServer } from 'http'
import './worker'

async function main() {
    const pp = await regs()
    const server = createServer(pp.reqHander)
    pp.logger.info('listen http://127.0.0.1:' + pp.config.port)
    server.listen(pp.config.port)

    pp.dbs.sequelize.sync({ force: true })
}

async function regs() {
    let pp = await container.getAsync<HanderApp>(HanderApp)

    // 类似路由注册
    pp.regWorker('dev', 1, () => container.getAsync('devWorker'))
    pp.regWorker('wxfanInfo', 1, () => container.getAsync('wxfanInfoWorker'))
    return pp
}

process.nextTick(main)
