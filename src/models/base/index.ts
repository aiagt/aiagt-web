export class Time {
  timestamp?: number

  constructor(timestamp?: number) {
    this.timestamp = timestamp
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