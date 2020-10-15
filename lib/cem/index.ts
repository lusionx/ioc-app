import { container } from '../glob'
import { provide, inject } from 'injection'
import { Campaign } from './model'
import { AppConfig } from '../conf'
import { BaseSvc } from '../svc/base'

@provide()
export class CemApi extends BaseSvc {

    @inject('appConfig')
    protected config: AppConfig

    private get root() {
        return this.config.cemRoot
    }

    async singleCampaigns(id: number) {
        const url = this.root + `/private/auto/campaigns` + id
        const res = await this.app.axios.get<Campaign>(url)
        return res.data
    }
}
container.bind(CemApi)
