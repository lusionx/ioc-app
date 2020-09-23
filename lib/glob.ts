import { Container } from 'injection'
import { createServer } from 'http'

export const container = new Container()

export const server = createServer()
