import { useMutation, useQueryClient } from '@tanstack/react-query'
import { arrive } from '../api/seating'

export function useArrive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: arrive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['status'] })
    },
  })
}
