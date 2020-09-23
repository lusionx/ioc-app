import { container } from '../glob'
import { provide, inject } from 'injection'
import axios from 'axios'
import { Campaign } from './model'
import { AppConfig } from '../conf'

@provide()
export class CemApi {

    @inject('appConfig')
    protected config: AppConfig

    private get root() {
        return this.config.cemRoot
    }

    async singleCampaigns(id: number) {
        const url = this.root + `/private/auto/campaigns` + id
        const res = await axios.get<Campaign>(url)
        return res.data
    }
}
container.bind(CemApi)
