import { provide } from 'injection'
import { container } from '../lib/glob'
import { AppCtx } from '../lib/app'
import { Job } from 'kue'

export interface TypedJob<T = any> extends Job {
    data: T
}

@provide()
export class BaseWorker<T = any> extends AppCtx {
    job: TypedJob<T>
    get body(): T {
        if (this.job) return this.job.data
        return super.body
    }
}
container.bind(BaseWorker)
