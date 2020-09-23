import { HanderApp, diContianer as container } from './lib/app'
import { createServer } from 'http'
import './worker'

async function main() {
    let pp = await container.getAsync<HanderApp>(HanderApp)

    pp.regWorker('dev', 1, await container.getAsync('devWorker'))

    const server = createServer(pp.reqHander)
    pp.logger.info('listen http://127.0.0.1:' + pp.config.port)
    server.listen(pp.config.port)
}

process.nextTick(main)
