'use client'

import { useStaffAssignments } from '@/lib/hooks/use-staff'
import { useTables } from '@/lib/hooks/use-tables'
import { motion } from 'framer-motion'
import { DuoCard } from '@/components/ui/duo-card'
import { DuoButton } from '@/components/ui/duo-button'

export default function StaffPage() {
  const { data: assignments, isLoading: assignmentsLoading } = useStaffAssignments()
  const { data: tables, isLoading: tablesLoading } = useTables()

  return (
    <div className="min-h-screen bg-duo-gray p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="text-5xl">👥</div>
              <div>
                <h1 className="text-4xl font-extrabold text-duo-darkGray">Staff Management</h1>
                <p className="text-lg text-gray-600">Assign waiters & chefs</p>
              </div>
            </div>
            <DuoButton variant="primary" size="lg">
              ➕ Add Staff
            </DuoButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Staff Assignments */}
          <DuoCard>
            <h3 className="text-2xl font-extrabold text-duo-darkGray mb-6">Active Assignments</h3>
            {assignmentsLoading ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-duo-green border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="mt-4 font-bold text-gray-600">Loading...</p>
              </div>
            ) : assignments && assignments.length > 0 ? (
              <div className="space-y-3">
                {assignments.map((assignment: any, index: number) => (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex justify-between items-center p-4 bg-duo-gray rounded-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">👨‍🍳</div>
                      <div>
                        <p className="font-bold text-duo-darkGray">{assignment.staff_name}</p>
                        <p className="text-sm text-gray-600">{assignment.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-duo-blue">
                        {assignment.assignment_type}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">👥</div>
                <p className="text-gray-600">No active assignments</p>
              </div>
            )}
          </DuoCard>

          {/* Tables Status */}
          <DuoCard>
            <h3 className="text-2xl font-extrabold text-duo-darkGray mb-6">Tables Status</h3>
            {tablesLoading ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-duo-green border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="mt-4 font-bold text-gray-600">Loading...</p>
              </div>
            ) : tables && tables.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {tables.map((table: any, index: number) => (
                  <motion.div
                    key={table.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-2xl text-center ${
                      table.state === 'occupied' ? 'bg-duo-error' :
                      table.state === 'reserved' ? 'bg-duo-yellow' :
                      'bg-duo-success'
                    }`}
                  >
                    <div className="text-2xl mb-2">🪑</div>
                    <p className="font-bold text-white">Table {table.number}</p>
                    <p className="text-xs text-white/80 capitalize">{table.state}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🪑</div>
                <p className="text-gray-600">No tables configured</p>
              </div>
            )}
          </DuoCard>
        </div>
      </div>
    </div>
  )
}
