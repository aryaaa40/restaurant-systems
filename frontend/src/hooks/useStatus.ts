import { useQuery } from '@tanstack/react-query'
import { getStatus } from '../api/seating'

export function useStatus() {
  return useQuery({
    queryKey: ['status'],
    queryFn: getStatus,
    refetchInterval: 2000,
  })
}
