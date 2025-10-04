import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/client'

export function useTables() {
  return useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      const response = await apiClient.tables.list()
      return response.data
    },
  })
}

export function useTable(id: string) {
  return useQuery({
    queryKey: ['tables', id],
    queryFn: async () => {
      const response = await apiClient.tables.get(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateTable() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.tables.create(data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    },
  })
}

export function useUpdateTableState() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, state }: { id: string; state: string }) => {
      const response = await apiClient.tables.updateState(id, state)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    },
  })
}
