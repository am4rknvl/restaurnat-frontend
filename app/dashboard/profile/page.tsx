'use client'

import { useAuthStore } from '@/lib/stores/auth-store'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { DuoCard } from '@/components/ui/duo-card'
import { DuoButton } from '@/components/ui/duo-button'
import { DuoInput } from '@/components/ui/duo-input'
import { apiClient } from '@/lib/api/client'

export default function ProfilePage() {
  const { user } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  const handleSave = async () => {
    try {
      await apiClient.customer.updateMe(formData)
      setIsEditing(false)
      alert('Profile updated successfully! ✅')
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  return (
    <div className="min-h-screen bg-duo-gray p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="text-5xl">👤</div>
            <div>
              <h1 className="text-4xl font-extrabold text-duo-darkGray">Profile</h1>
              <p className="text-lg text-gray-600">Manage your account</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="md:col-span-2">
            <DuoCard>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-extrabold text-duo-darkGray">Personal Info</h3>
                {!isEditing ? (
                  <DuoButton onClick={() => setIsEditing(true)} variant="secondary" size="sm">
                    ✏️ Edit
                  </DuoButton>
                ) : (
                  <div className="flex gap-2">
                    <DuoButton onClick={() => setIsEditing(false)} variant="error" size="sm">
                      ❌ Cancel
                    </DuoButton>
                    <DuoButton onClick={handleSave} variant="success" size="sm">
                      ✅ Save
                    </DuoButton>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <DuoInput
                    label="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <DuoInput
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <DuoInput
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-bold text-gray-600">Name</p>
                    <p className="text-lg text-duo-darkGray">{user?.name || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Email</p>
                    <p className="text-lg text-duo-darkGray">{user?.email || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">Phone</p>
                    <p className="text-lg text-duo-darkGray">{user?.phone || 'Not set'}</p>
                  </div>
                </div>
              )}
            </DuoCard>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <DuoCard>
              <div className="text-center">
                <div className="text-5xl mb-3">⚡</div>
                <div className="text-3xl font-extrabold text-duo-green mb-2">1,250</div>
                <div className="text-sm font-bold text-gray-600">Total XP</div>
              </div>
            </DuoCard>

            <DuoCard>
              <div className="text-center">
                <div className="text-5xl mb-3">🏆</div>
                <div className="text-3xl font-extrabold text-duo-yellow mb-2">Level 5</div>
                <div className="text-sm font-bold text-gray-600">Your Level</div>
              </div>
            </DuoCard>

            <DuoCard>
              <div className="text-center">
                <div className="text-5xl mb-3">🔥</div>
                <div className="text-3xl font-extrabold text-duo-error mb-2">12</div>
                <div className="text-sm font-bold text-gray-600">Day Streak</div>
              </div>
            </DuoCard>
          </div>
        </div>
      </div>
    </div>
  )
}
