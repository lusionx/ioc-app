import { provide } from 'injection'
import { container } from '../glob'
import { BaseSvc } from './base'

@provide()
export class RedisSvc extends BaseSvc {
    async setJSON<T>(k: string, v: T, d: number): Promise<void> {
        await this.set(k, JSON.stringify(v), d)
    }
    /**
     * 获取json缓存
     * @param k
     */
    async getJSON<T>(k: string): Promise<T | undefined> {
        const v = await this.get(k)
        if (v) {
            return JSON.parse(v)
        }
    }
    incr(k: string): Promise<number> {
        const { client } = this.app.queue
        return new Promise((res, rej) => {
            client.INCR(k, (err, reply) => {
                err ? rej(err) : res(reply)
            })
        })
    }
    get(k: string): Promise<string> {
        const { client } = this.app.queue
        return new Promise<string>((res, rej) => {
            client.GET(k, (err, reply) => {
                err ? rej(err) : res(reply || "")
            })
        })
    }
    set(k: string, v: string, ss: number, flag?: 'NX' | 'XX'): Promise<'OK' | undefined> {
        const { client } = this.app.queue
        return new Promise<'OK' | undefined>((res, rej) => {
            if (flag) {
                client.SET(k, v, 'EX', ss, flag, (err, reply) => {
                    err ? rej(err) : res(reply)
                })
            } else {
                client.SET(k, v, 'EX', ss, (err, reply) => {
                    err ? rej(err) : res(reply)
                })
            }
        })
    }
    expire(k: string, seconds: number): Promise<number> {
        const { client } = this.app.queue
        return new Promise((res, rej) => {
            client.EXPIRE(k, seconds, (err, reply) => {
                err ? rej(err) : res(reply)
            })
        })
    }
    async cache<T>(k: string, ss: number, ff: () => Promise<T>, vaild?: (res: T) => any): Promise<T> {
        let v = await this.getJSON<T>(k)
        if (v) return v
        v = await ff()
        if (!vaild || vaild(v)) {
            await this.setJSON(k, v, ss)
        }
        return v
    }
    del(k: string): Promise<number> {
        const { client } = this.app.queue
        return new Promise<number>((res, rej) => {
            client.DEL(k, (err, reply) => {
                err ? rej(err) : res(reply)
            })
        })
    }
    zadd(k: string, s: number, v: string): Promise<number> {
        const { client } = this.app.queue
        return new Promise<number>((res, rej) => {
            client.ZADD(k, s, v, (err, reply) => {
                err ? rej(err) : res(reply)
            })
        })
    }
    zrem(k: string, v: string): Promise<number> {
        const { client } = this.app.queue
        return new Promise<number>((res, rej) => {
            client.ZREM(k, v, (err, reply) => {
                err ? rej(err) : res(reply)
            })
        })
    }
    zcard(k: string): Promise<number> {
        const { client } = this.app.queue
        return new Promise<number>((res, rej) => {
            client.ZCARD(k, (err, reply) => {
                err ? rej(err) : res(reply)
            })
        })
    }
    zrange(k: string, start: number = 0, stop: number = -1): Promise<string[]> {
        const { client } = this.app.queue
        return new Promise<string[]>((res, rej) => {
            client.ZRANGE(k, start, stop, (err, reply) => {
                err ? rej(err) : res(reply)
            })
        })
    }
    /** 有性能问题 少用 */
    keys(m: string) {
        const { client } = this.app.queue
        return new Promise<string[]>((res, rej) => {
            client.KEYS(m, (err, ks) => {
                err ? rej(err) : res(ks)
            })
        })
    }
    publish(channel: string, value: string) {
        const { client } = this.app.queue
        return new Promise<number>((res, rej) => {
            client.publish(channel, value, (err, ks) => {
                err ? rej(err) : res(ks)
            })
        })
    }
    sadd(k: string, value: string) {
        const { client } = this.app.queue
        return new Promise<number>((res, rej) => {
            client.SADD(k, value, (err, reply) => {
                err ? rej(err) : res(reply)
            })
        })
    }
    smenber(k: string) {
        const { client } = this.app.queue
        return new Promise<string[]>((res, rej) => {
            client.SMEMBERS(k, (err, reply) => {
                err ? rej(err) : res(reply)
            })
        })
    }
}
container.bind(RedisSvc)
