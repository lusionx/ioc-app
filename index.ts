import { HanderApp, diContianer as container } from './lib/app'
import { createServer } from 'http'
import './worker'

async function main() {
    let pp = await container.getAsync<HanderApp>(HanderApp)

    pp.regWorker('dev', 1, () => container.getAsync('devWorker'))

    const server = createServer(pp.reqHander)
    pp.logger.info('listen http://127.0.0.1:' + pp.config.port)
    server.listen(pp.config.port)

    pp.dbs.sequelize.sync({ force: true })
}

process.nextTick(main)
