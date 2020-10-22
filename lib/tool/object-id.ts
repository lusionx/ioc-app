/* Buffalo by Marcello Bastea-Forte - zlib license */

import { createHash } from 'crypto'
import * as  util from 'util'
import { hostname } from 'os'

// Generate machine hash
//  from docs: This is the first three bytes of the (md5) hash of the machine host name, or of the mac/network address,
//     or the virtual machine id.

const machineHash = createHash('md5').update(hostname()).digest()

// Pre-cache the machine hash / pid
const machineAndPid = [
    machineHash[0],
    machineHash[1],
    machineHash[2],
    (process.pid) & 0xFF,
    (process.pid >> 8) & 0xFF
]

// ObjectId increment
let inc = Math.floor(Math.random() * 1e4)

// 32 bit time
// 24 bit machine id
// 16 bit pid
// 24 bit increment
export class ObjectId {
    bytes: Buffer
    /**
     *
     * @param bytes buffer, stringHex, number
     */
    constructor(bytes?: any) {
        if (Buffer.isBuffer(bytes)) {
            if (bytes.length != 12) throw new Error("Buffer-based ObjectId must be 12 bytes")
            this.bytes = bytes
        } else if (util.isString(bytes)) {
            if (bytes.length != 24) throw new Error("String-based ObjectId must be 24 bytes")
            if (!/^[0-9a-f]{24}$/i.test(bytes)) throw new Error("String-based ObjectId must in hex-format:" + bytes)
            this.bytes = Buffer.from(bytes, 'hex')
        } else if (util.isNumber(bytes) || util.isDate(bytes)) {
            this.bytes = this._objectId(+bytes)
        } else if (!util.isUndefined(bytes)) {
            throw new Error("Unrecognized type: " + bytes)
        } else {
            this.bytes = this._objectId(Date.now())
        }
    }

    private _objectId(time: number) {
        var timestamp = (time / 1000) & 0xFFFFFFFF
        inc = ~~inc + 1 // keep as integer
        return Buffer.from([
            timestamp >> 24,
            timestamp >> 16,
            timestamp >> 8,
            timestamp,
            machineAndPid[0],
            machineAndPid[1],
            machineAndPid[2],
            machineAndPid[3],
            machineAndPid[4],
            inc >> 16,
            inc >> 8,
            inc
        ]);
    }

    toString() {
        return this.vauleOf()
    }
    toJSON() {
        return this.toBase64()
    }
    toBase64() {
        return this.bytes.toString('base64').replace(/\+/g, '-').replace(/\//g, '_')
    }
    vauleOf() {
        return `ObjectId(${this.bytes.toString('hex')})`
    }
}

export function createObjId() {
    return new ObjectId()
}
