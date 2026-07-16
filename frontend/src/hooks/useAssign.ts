import { useMutation, useQueryClient } from '@tanstack/react-query'
import { assignPartyToTable } from '../api/seating'

export function useAssign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: assignPartyToTable,
    onSuccess: (data) => {
      queryClient.setQueryData(['status'], data)
    },
  })
}
