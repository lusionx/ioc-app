import { container } from '../glob'
import { provide, inject } from 'injection'
import axios from 'axios'
import { Campaign } from './model'
import { AppConfig } from '../../config'

@provide()
export class CemApi {

    @inject('appConfig')
    config: AppConfig

    get root() {
        return this.config.cemRoot
    }

    async singleCampaigns(id: number) {
        const url = this.root + `/private/auto/campaigns` + id
        const res = await axios.get<Campaign>(url)
        return res.data
    }
}
container.bind(CemApi)
