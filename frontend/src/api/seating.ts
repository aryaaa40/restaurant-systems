import { apiClient } from './client'
import type {
  ArrivePayload,
  ArriveResponse,
  ServePayload,
  StatusResponse,
  HistoryResponse,
  AssignPayload,
} from '../types/seating'

export async function arrive(payload: ArrivePayload): Promise<ArriveResponse> {
  const { data } = await apiClient.post<ArriveResponse>('/arrive', payload)
  return data
}

export async function assignPartyToTable(payload: AssignPayload): Promise<StatusResponse> {
  const { data } = await apiClient.post<StatusResponse>('/assign', payload)
  return data
}

export async function getStatus(): Promise<StatusResponse> {
  const { data } = await apiClient.get<StatusResponse>('/status')
  return data
}

export async function serve(payload: ServePayload): Promise<StatusResponse> {
  const { data } = await apiClient.post<StatusResponse>('/serve', payload)
  return data
}

export async function getHistory(): Promise<HistoryResponse> {
  const { data } = await apiClient.get<HistoryResponse>('/history')
  return data
}
