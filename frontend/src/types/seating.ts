export type TableCode = 'A' | 'B' | 'C' | 'D'

export interface SeatedParty {
  id: number
  name: string
  size: number
}

export interface CurrentSeating {
  party: SeatedParty
  seated_at: string
  estimated_end_at: string
  duration_minutes: number
}

export interface TableStatus {
  id: number
  code: TableCode
  capacity: number
  status: 'available' | 'occupied'
  seating: CurrentSeating | null
}

export interface QueuedParty {
  id: number
  name: string
  size: number
  arrived_at: string
}

export interface StatusResponse {
  tables: TableStatus[]
  queue: QueuedParty[]
}

export interface ArrivePayload {
  name: string
  size: number
}

export interface ArriveResponse {
  party: {
    id: number
    name: string
    size: number
    status: 'seated' | 'waiting'
  }
}

export interface ServePayload {
  table_id: number
}

export interface HistoryEntry {
  id: number
  table_code: string
  party_name: string
  party_size: number
  seated_at: string
  completed_at: string | null
  duration_minutes: number
}

export interface HistoryResponse {
  history: HistoryEntry[]
}
