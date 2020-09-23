import { HanderApp } from './lib/app'
import { container, } from './lib/glob'
import { createServer } from 'http'


async function main() {
    let pp = await container.getAsync<HanderApp>(HanderApp)
    const server = createServer(pp.reqHander)
    pp.logger.info('listen http://127.0.0.1:' + pp.config.port)
    server.listen(pp.config.port)
}

process.nextTick(main)
