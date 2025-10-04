import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/client'

export function useKitchenOrders() {
  return useQuery({
    queryKey: ['kitchen-orders'],
    queryFn: async () => {
      const response = await apiClient.kitchen.listPendingOrders()
      return response.data
    },
    refetchInterval: 5000,
  })
}

export function useUpdateKitchenOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiClient.kitchen.updateOrderStatus(id, status)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
