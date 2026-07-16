import { useQuery } from '@tanstack/react-query'
import { getHistory } from '../api/seating'

export function useHistory() {
  return useQuery({
    queryKey: ['history'],
    queryFn: getHistory,
  })
}
