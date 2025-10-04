import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/client'

export function useStaffAssignments() {
  return useQuery({
    queryKey: ['staff-assignments'],
    queryFn: async () => {
      const response = await apiClient.enterprise.staffAssignments.list()
      return response.data
    },
  })
}

export function useAssignWaiter() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ branchId, tableId, waiterId }: { branchId: string; tableId: string; waiterId: string }) => {
      const response = await apiClient.staff.assignWaiterToTable(branchId, tableId, waiterId)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-assignments'] })
    },
  })
}

export function useAssignChef() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ branchId, orderId, chefId }: { branchId: string; orderId: string; chefId: string }) => {
      const response = await apiClient.staff.assignChefToOrder(branchId, orderId, chefId)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-assignments'] })
    },
  })
}
