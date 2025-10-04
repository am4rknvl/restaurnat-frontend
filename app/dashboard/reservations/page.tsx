'use client'

import { useReservations, useCreateReservation } from '@/lib/hooks/use-reservations'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { DuoCard } from '@/components/ui/duo-card'
import { DuoButton } from '@/components/ui/duo-button'
import { DuoInput } from '@/components/ui/duo-input'

export default function ReservationsPage() {
  const { data: reservations, isLoading } = useReservations()
  const createReservation = useCreateReservation()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    date: '',
    time: '',
    party_size: 2,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createReservation.mutateAsync(formData)
      setShowForm(false)
      setFormData({ customer_name: '', phone: '', date: '', time: '', party_size: 2 })
    } catch (error) {
      console.error('Failed to create reservation:', error)
    }
  }

  return (
    <div className="min-h-screen bg-duo-gray p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="text-5xl">📅</div>
            <div>
              <h1 className="text-4xl font-extrabold text-duo-darkGray">Reservations</h1>
              <p className="text-lg text-gray-600">Manage table bookings</p>
            </div>
          </div>
          <DuoButton onClick={() => setShowForm(!showForm)} variant="primary" size="lg">
            {showForm ? '❌ Cancel' : '➕ New Reservation'}
          </DuoButton>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <DuoCard>
              <h3 className="text-2xl font-extrabold text-duo-darkGray mb-6">Create Reservation</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DuoInput
                    label="Customer Name"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                    placeholder="John Doe"
                  />
                  <DuoInput
                    label="Phone Number"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1234567890"
                  />
                  <DuoInput
                    label="Date"
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                  <DuoInput
                    label="Time"
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                  <DuoInput
                    label="Party Size"
                    type="number"
                    min="1"
                    required
                    value={formData.party_size}
                    onChange={(e) => setFormData({...formData, party_size: parseInt(e.target.value)})}
                  />
                </div>
                <DuoButton type="submit" variant="success" size="lg" className="w-full">
                  ✅ Confirm Reservation
                </DuoButton>
              </form>
            </DuoCard>
          </motion.div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-duo-green border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 font-bold text-gray-600">Loading reservations...</p>
          </div>
        ) : reservations && reservations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservations.map((reservation: any, index: number) => (
              <motion.div
                key={reservation.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <DuoCard>
                  <div className="text-4xl mb-4">🍽️</div>
                  <h3 className="text-xl font-extrabold text-duo-darkGray mb-2">
                    {reservation.customer_name}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>📅 {reservation.date} at {reservation.time}</p>
                    <p>👥 {reservation.party_size} guests</p>
                    <p>📞 {reservation.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <DuoButton variant="secondary" size="sm" className="flex-1">✏️ Edit</DuoButton>
                    <DuoButton variant="error" size="sm" className="flex-1">❌ Cancel</DuoButton>
                  </div>
                </DuoCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <DuoCard hover={false}>
            <div className="text-center py-12">
              <div className="text-8xl mb-4">📅</div>
              <h3 className="text-2xl font-extrabold text-duo-darkGray mb-2">No reservations yet</h3>
              <p className="text-gray-600 mb-6">Start accepting table bookings!</p>
              <DuoButton onClick={() => setShowForm(true)} variant="primary" size="lg">
                ➕ Create First Reservation
              </DuoButton>
            </div>
          </DuoCard>
        )}
      </div>
    </div>
  )
}
