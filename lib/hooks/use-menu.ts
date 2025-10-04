import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/client'

export function useMenuItems(params?: { category?: string; available?: boolean }) {
  return useQuery({
    queryKey: ['menu-items', params],
    queryFn: async () => {
      const response = await apiClient.menu.items.list(params)
      return response.data
    },
  })
}

export function useMenuItem(id: string) {
  return useQuery({
    queryKey: ['menu-items', id],
    queryFn: async () => {
      const response = await apiClient.menu.items.get(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useMenuCategories() {
  return useQuery({
    queryKey: ['menu-categories'],
    queryFn: async () => {
      const response = await apiClient.menu.categories.list()
      return response.data
    },
  })
}

export function useQRMenu(restaurantId: string, tableId: string) {
  return useQuery({
    queryKey: ['qr-menu', restaurantId, tableId],
    queryFn: async () => {
      const response = await apiClient.menu.getQRMenu(restaurantId, tableId)
      return response.data
    },
    enabled: !!restaurantId && !!tableId,
  })
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.menu.items.create(data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] })
    },
  })
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiClient.menu.items.update(id, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] })
      queryClient.invalidateQueries({ queryKey: ['menu-items', variables.id] })
    },
  })
}

export function useUpdateMenuItemAvailability() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, available }: { id: string; available: boolean }) => {
      const response = await apiClient.menu.items.updateAvailability(id, available)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] })
    },
  })
}
