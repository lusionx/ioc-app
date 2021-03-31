/**
 * 防 mongo 的查询语法, 判断对象是否符合规则
 */

import * as _ from 'util'

/**
 * 将单 key 的 obj 转换
 * @param o
 */
function kv(o: any) {
    let ks = Object.keys(o)
    if (ks.length !== 1) {
        throw new Error(ks.length + ' keys: ' + ks.join(' '))
    }
    return {
        key: ks[0],
        value: o[ks[0]]
    }
}

/**
 * 按 a.b.c 向内取值
 * @param path
 * @param val
 */
function pathVal(path: string, val: any): any {
    let pp = path.split('.')
    let orig = val
    let xv = null
    for (let k of pp) {
        if (Object.keys(orig).includes(k)) {
            xv = orig[k]
            orig = xv
        } else {
            return undefined
        }
    }
    return xv
}

type filter = (val: any) => boolean

function _q_term(f: string, expv: any) {
    let fn: filter = (val: any) => {
        let vx = pathVal(f, val)
        return expv === vx
    }
    return fn
}

function _q_like(f: string, expv: any) {
    if (!_.isString(expv)) {
        throw new Error(`val of query ${f} is string ${expv}`)
    }
    let fn: filter = (val: any) => {
        let vx = pathVal(f, val)
        if (!vx) return false
        return vx.includes(expv)
    }
    return fn
}

function _q_range_gt(f: string, expv: any) {
    let fn: filter = (val: any) => {
        let vx = pathVal(f, val)
        return vx > expv
    }
    return fn
}

function _q_range_gte(f: string, expv: any) {
    let fn: filter = (val: any) => {
        let vx = pathVal(f, val)
        return vx >= expv
    }
    return fn
}

function _q_range_lt(f: string, expv: any) {
    let fn: filter = (val: any) => {
        let vx = pathVal(f, val)
        return vx < expv
    }
    return fn
}

function _q_range_lte(f: string, expv: any) {
    let fn: filter = (val: any) => {
        let vx = pathVal(f, val)
        return vx <= expv
    }
    return fn
}

function _q_in(f: string, expv: any[]) {
    if (!_.isArray(expv)) {
        throw new Error(`val of query ${f} is not array ${expv}`)
    }
    let fn: filter = (val: any) => {
        let vx = pathVal(f, val)
        if (_.isArray(vx)) {
            return vx.every(e => expv.includes(e))
        } else {
            return expv.includes(vx)
        }
    }
    return fn
}

function _q_exists(f: string, expv: boolean) {
    if (!_.isBoolean(expv)) {
        throw new Error(`val of query ${f} is not boolean ${expv}`)
    }
    let pp = f.split('.')

    if (expv) {
        let fn: filter = (val: any) => {
            let orig = val
            let xv = null
            for (let k of pp) {
                if (Object.keys(orig).includes(k)) {
                    xv = orig[k]
                    orig = xv
                } else {
                    return false
                }

            }
            return true
        }
        return fn
    }
    let fn: filter = (val: any) => {
        let orig = val
        let xv = null
        for (let k of pp) {
            if (Object.keys(orig).includes(k)) {
                xv = orig[k]
                orig = xv
            } else {
                return true
            }

        }
        return false
    }
    return fn

}

/**
 *
 * @param q 必须是单一 key
 */
function _query(q: any): BoolFilter {
    const must: filter[] = []
    const must_not: filter[] = []
    const sp = kv(q)
    let { key: f, value: val } = sp
    if (_.isString(val) || _.isNumber(val) || _.isBoolean(val)) {
        val = { $eq: val }
    }
    for (let $$ in val) {
        let vv = val[$$] // 操作符 $xx 的值
        switch ($$) {
            case '$eq':
                must.push(_q_term(f, vv))
                break
            case '$ne':
                must_not.push(_q_term(f, vv))
                break
            case '$like':
                must.push(_q_like(f, vv))
                break
            case '$notLike':
                must_not.push(_q_like(f, vv))
                break
            case '$gt':
                must.push(_q_range_gt(f, vv))
                break
            case '$gte':
                must.push(_q_range_gte(f, vv))
                break
            case '$lt':
                must.push(_q_range_lt(f, vv))
                break
            case '$lte':
                must.push(_q_range_lte(f, vv))
                break
            case '$in':
                must.push(_q_in(f, vv))
                break
            case '$nin':
                must_not.push(_q_in(f, vv))
                break
            case '$notIn':
                must_not.push(_q_in(f, vv))
                break
            case '$exists':
                must.push(_q_exists(f, vv))
                break
            case '$not':
                let o = { [f]: vv }
                must_not.push(..._query(o).must)
                break
            default:
                throw new Error('not suport ' + $$ + ' ' + JSON.stringify(vv))
        }
    }
    return { must, must_not, should: [] }
}

interface BoolFilter {
    must: filter[]
    must_not: filter[]
    should: filter[]
    /** 忽略其他条件 */
    boolean?: BoolFilter
}

function _and(arr: any[]) {
    if (!_.isArray(arr)) {
        throw new Error('$and: must be Array')
    }
    const boof: BoolFilter = { must: [], must_not: [], should: [] }
    arr.forEach((q) => {
        for (const k of Object.keys(q)) {
            let v = q[k]
            if (k === '$and') {
                boof.boolean = _and(v)
            } else {
                let q = _query({ [k]: v })
                boof.must.push(...q.must)
                boof.must_not.push(...q.must_not)
            }
        }
    })
    return boof
}

class Query {
    qObj: any
    constructor(public query: BoolFilter) {
    }
    check(val: any): boolean {
        if (this.query.boolean) {
            return new Query(this.query.boolean).check(val)
        }
        const { must, must_not, should } = this.query

        const mst = must.length ? (() => {
            for (let fn of must) {
                if (false === fn(val)) return false
            }
            return true
        })() : true

        const mnt = must_not.length ? (() => {
            for (let fn of must_not) {
                if (true === fn(val)) return false
            }
            return true
        })() : true

        const shd = should.length ? (() => {
            for (let fn of should) {
                if (true === fn(val)) return true
            }
            return false
        })() : true
        return mst && mnt && shd
    }
}

export function compile(q: any) {
    const boof: BoolFilter = { must: [], must_not: [], should: [] }
    const { must, must_not } = boof
    for (let k of Object.keys(q)) {
        let v = q[k]
        if (k === '$and') {
            boof.boolean = _and(v)
        } else {
            let q = _query({ [k]: v })
            must.push(...q.must)
            must_not.push(...q.must_not)
        }
    }
    const ter = new Query(boof)
    ter.qObj = q
    return ter
}

function showQuery(query: BoolFilter) {
    if (query.must.length) {
        console.log('must [%s]', query.must.length)
        query.must.forEach(fn => console.log(fn.toString()))
    }
    if (query.must_not.length) {
        console.log('must_not [%s]', query.must_not.length)
        query.must_not.forEach(fn => console.log(fn.toString()))
    }
    if (query.boolean) {
        showQuery(query.boolean)
    }
}

export function check(rule: any, val: any, log?: boolean) {
    let q = compile(rule)
    if (log) {
        showQuery(q.query)
    }
    return q.check(val)
}


function test() {
    console.log('test', __filename)

    const d1 = { a: 1 }
    console.assert(check({ a: 1 }, d1))
    console.assert(!check({ a: 2 }, d1))

    console.assert(check({ a: { $gte: 1 } }, d1))
    console.assert(!check({ a: { $gt: 1 } }, d1))

    console.assert(check({ a: { $exists: true } }, d1))
    console.assert(!check({ 'a.b': { $exists: true } }, d1), 'exists')
    console.assert(!check({ a: { $exists: false } }, d1), 'exists false')

    console.assert(!check({ a: { $in: [2] } }, d1))
    console.assert(check({ a: { $in: [1, 2] } }, d1))

    console.assert(check({ a: { $ne: 2 } }, d1), 'ne')
    console.assert(!check({ a: { $ne: 1 } }, d1), 'ne not')

    const d11 = { a: [1, 11, 2] }
    console.assert(check({ a: { $in: [1, 2, 11, 12] } }, d11), '$in arr')
    console.assert(!check({ a: { $in: [1, 2] } }, d11), '$in arr false')

    const d2 = { a: 1, b: 'swe' }
    console.assert(check({ a: 1, b: 'swe' }, d2), 'eq val')
    console.assert(!check({ a: 2, b: 'swe' }, d2), 'eq val false')

    console.assert(check({ a: 1, b: { $ne: 'aaa' } }, d2), 'eq + ne')
    console.assert(!check({ a: 1, b: { $ne: 'swe' } }, d2), 'eq + ne false')

    console.assert(check({ b: { $like: 'w' } }, d2), 'like true')
    console.assert(!check({ b: { $like: 'x' } }, d2), 'like false')

    const d22 = { a: 1, c: { a: 1, b: 'bbb' } }
    console.assert(check({ 'c.a': 1 }, d22), 'path a.a')

    console.assert(check({ $and: [{ a: 1 }, { "c.a": 1 }] }, d22), 'and')
    console.assert(!check({ $and: [{ a: 1 }, { "c.a": 2 }] }, d22), 'and false')
}

if (process.argv[1] === __filename) {
    test()
}
