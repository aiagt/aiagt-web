import { format } from 'date-fns'

export class Time {
  timestamp?: number

  constructor(time: { timestamp?: number }) {
    this.timestamp = time?.timestamp
  }

  date(): Date | null {
    return this.timestamp ? new Date(this.timestamp) : null
  }

  expired(): boolean {
    if (!this.timestamp) {
      return false
    }

    return this.timestamp < Date.now()
  }

  string(): string {
    const date = this.date()
    if (!date) return ''
    return format(date, 'yyyy-MM-dd HH:mm:ss')
  }
}

export interface PaginationReq {
  page?: number;
  page_size?: number;
}

export interface PaginationResp {
  page: number;
  page_size: number;
  total: number;
  page_total: number;
}