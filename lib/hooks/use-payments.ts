import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/client'

export function usePayment(id: string) {
  return useQuery({
    queryKey: ['payments', id],
    queryFn: async () => {
      const response = await apiClient.payments.get(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.payments.create(data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
  })
}

export function useRefundPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount?: number }) => {
      const response = await apiClient.payments.refund(id, amount)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
  })
}

export function useTelebirrPayment() {
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.payments.telebirr.c2b.create(data)
      return response.data
    },
  })
}

export function useChapaPayment() {
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.payments.create({ ...data, method: 'chapa' })
      return response.data
    },
  })
}
