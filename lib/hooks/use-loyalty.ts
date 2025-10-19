import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'

export function useLoyalty() {
  return useQuery({
    queryKey: ['loyalty'],
    queryFn: async () => {
      const response = await apiClient.customer.loyalty.get()
      return response.data
    },
  })
}

export function useRedeemReward() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (points: number) => apiClient.customer.loyalty.redeem(points),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty'] })
    },
  })
}
