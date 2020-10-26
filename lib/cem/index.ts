import { container } from '../glob'
import { Campaign } from './model'
import { BaseSvc } from '../svc/base'
import { provide } from 'injection'

@provide()
export class CemApi extends BaseSvc {
    private get root() {
        return this.app.config.cemRoot
    }

    async singleCampaigns(id: number) {
        const url = this.root + `/private/auto/campaigns` + id
        const res = await this.axios.get<Campaign>(url)
        return res.data
    }
}
container.bind(CemApi)

export { WxApi } from './wx-api'
