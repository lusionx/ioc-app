import { provide, scope, ScopeEnum } from 'injection'
import { container } from '../lib/glob'
import { AppCtx } from '../lib/app'
import { Job } from 'kue'

export interface TypedJob<T = any> extends Job {
    data: T
}

@scope(ScopeEnum.Prototype)
@provide()
export class BaseWorker<T = any> extends AppCtx {
    job: TypedJob<T>
}
container.bind(BaseWorker)
