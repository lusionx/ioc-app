

export interface Campaign {
    id: number
    status: 'stop' | 'running'
    trigger_type: 'batch' | 'realtime'
    campaign_auto_tasks: CampaignTask[]
}

export interface CampaignTask {
    id: number
    enterprise_id: number
    campaign_id: number
    campaign_task_id: string
    parent_id: string
    task_type: "control_filter",
    category: "control" | "push"
    campaign_task_content: TaskContent
}

export interface TaskContent {
    branches: {
        yes: string
        no: string
    }
    sql: string
}
