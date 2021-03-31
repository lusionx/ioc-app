/**
 * 构建es-dsl的工具
 */

import * as _ from 'lodash'

type qVER = 1 | 2
type TermOp = 'term' | 'terms' | 'range' | 'type' | 'ids' | 'exists' | 'missing' | 'bool'
type TermVal = string | number
interface qBody {
    query: any
    aggs?: any
    size?: number
    from?: number
}

interface qBool {
    must?: any
    must_not?: any
    should?: any
    minimum_should_match?: number
}

export class eBool {
    private _version: qVER
    private _must: any[]
    private _must_not: any[]
    private _should!: any[]
    private _minimum_should_match!: number
    constructor(version: qVER = 2) {
        this._version = version
        this._must = []
        this._must_not = []
    }
    protected get must() { return this._must }
    protected get must_not() { return this._must_not }

    public should(bs: eBool, i: number = 1) {
        this._should = bs.must
        for (let ee of bs.must_not) {
            this._should.push({
                bool: {
                    must_not: [ee]
                }
            })
        }
        // console.log('%j', this._should)
        this._minimum_should_match = i
        return this
    }
    public bool(bs: eBool, m: boolean = true) {
        if (m) {
            this._must.push({ bool: bs.theBool })
        } else {
            this._must_not.push({ bool: bs.theBool })
        }
        return this
    }
    public term(f: string, v: TermVal, canMiss?: boolean) {
        if (canMiss) {
            let b = new eBool(this._version).term(f, v).missing(f)
            let b2 = new eBool(this._version).should(b)
            this.bool(b2)
        } else {
            let e = { term: { [f]: v } }
            this._must.push({ term: { [f]: v } })
        }
        return this
    }
    public termNot(f: string, v: TermVal) {
        let e = { [f]: v }
        this._must_not.push({ term: e })
        return this
    }
    public terms(f: string, v: TermVal[]) {
        let e = { [f]: v }
        this._must.push({ terms: e })
        return this
    }
    public termsNot(f: string, v: TermVal[]) {
        let e = { [f]: v }
        this._must_not.push({ terms: e })
        return this
    }
    public range(f: string, v: { gt?: TermVal, gte?: TermVal, lt?: TermVal, lte?: TermVal }, canMiss?: boolean) {
        if (!v || Object.keys(v).length === 0) {
            return this
        }
        if (canMiss) {
            let b = new eBool(this._version).range(f, v).missing(f)
            let b2 = new eBool(this._version).should(b)
            this.bool(b2)
        } else {
            this._must.push({ range: { [f]: v } })
        }
        return this
    }
    public rangeNot(f: string, v: { gt?: TermVal, gte?: TermVal, lt?: TermVal, lte?: TermVal }) {
        if (!v || Object.keys(v).length === 0) {
            return this
        }
        this._must_not.push({ range: { [f]: v } })
        return this
    }
    public exists(f: string) {
        this._must.push({ exists: { field: f } })
        return this
    }
    public missing(f: string) {
        this._must_not.push({ exists: { field: f } })
        return this
    }
    public type(_type: string) {
        this._must.push({ type: { value: _type } })
        return this
    }
    public typeNot(_type: string) {
        this._must_not.push({ type: { value: _type } })
        return this
    }
    public ids(values: string[], _type?: string) {
        this._must.push({ ids: { values }, type: _type })
        return this
    }
    public get theBool(): qBool {
        let bool: qBool = {}
        if (this._must.length) {
            bool.must = this._must
        }
        if (this._must_not.length) {
            bool.must_not = this._must_not
        }
        if (this._should && this._should.length) {
            bool.should = this._should
            bool.minimum_should_match = this._minimum_should_match
        }
        return bool
    }
    public nested(f: string, bs: eBool) {
        let bool = bs.theBool
        const nested = {
            path: f,
            query: { bool },
        }
        this._must.push({ nested })
        return this
    }
    public queryString(f: string, word: string) {
        let query_string = {
            default_field: f,
            query: word,
        }
        this._must.push({ query_string })
        return this
    }
    public getBody(): qBody {
        let bool = this.theBool
        if (this._version === 1) {
            return { query: { filtered: { filter: { bool } } } }
        }
        if (this._version === 2) {
            return { query: { bool: { filter: { bool } } } }
        }
        return { query: {} }
    }
    public toString(): string {
        return JSON.stringify(this.getBody())
    }
    static un2Arr(obj: Object) {
        const res: FieldItem[] = []
        if (!_.isObject(obj)) return res
        if (_.isObject(obj) && _.isArray(obj)) return res
        const bl = iterBool([obj])
        if (bl) {
            deepInto(bl, res)
        }
        return res
    }
    static un2Obj(obj: Object): any {
        const res: any = {}
        for (const ee of eBool.un2Arr(obj)) {
            res[ee.field] = _.extend(res[ee.field] || {}, ee)
        }
        return res
    }
}

/** 广度的方式找到第一个bool */
function iterBool(objs: Object[]): qBool | undefined {
    const KEY = 'bool'
    const lv1: Object[] = []
    for (const obj of objs) {
        for (const key in obj) {
            const vv = _.get(obj, key)
            if (key === KEY && !_.get(obj, key + '.filter')) return vv
            lv1.push(vv)
        }
    }
    return iterBool(lv1)
}

function deepInto(bl: qBool, res: FieldItem[]) {
    const allitem: any[] = []
    if (bl.must && bl.must.length) allitem.push(...bl.must)
    if (bl.must_not && bl.must_not.length) allitem.push(...bl.must_not)
    if (bl.should && bl.should.length) allitem.push(...bl.should)
    for (const e of allitem) {
        const { term, terms, range, exists, bool, ids } = e
        if (term) {
            const key = Object.keys(term)[0]
            res.push(new FieldItem(key, 'term', term[key], term))
        } else if (terms) {
            const key = Object.keys(terms)[0]
            res.push(new FieldItem(key, 'terms', terms[key], terms))
        } else if (range) {
            const key = Object.keys(range)[0]
            res.push(new FieldItem(key, 'range', range[key], range[key]))
        } else if (exists) {
            const key = 'field'
            res.push(new FieldItem(exists[key], 'exists', undefined, exists))
        } else if (ids) {
            res.push(new FieldItem('_id', 'ids', ids.values, ids))
        } else if (bool) {
            deepInto(bool as qBool, res)
        } else {
            const bl = iterBool(e)
            if (bl) deepInto(bl, res)
        }
    }
}

class FieldItem {
    constructor(public field: string, public query: TermOp, public value: any, public ref?: any) {
    }
}
