import { useMutation, useQueryClient } from '@tanstack/react-query'
import { serve } from '../api/seating'

export function useServe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: serve,
    onSuccess: (data) => {
      queryClient.setQueryData(['status'], data)
    },
  })
}
