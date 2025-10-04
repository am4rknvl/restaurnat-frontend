'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useMenuItem, useUpdateMenuItem } from '@/lib/hooks/use-menu'
import { useMenuCategories } from '@/lib/hooks/use-menu'
import { motion } from 'framer-motion'
import { DuoCard } from '@/components/ui/duo-card'
import { DuoButton } from '@/components/ui/duo-button'
import { DuoInput } from '@/components/ui/duo-input'

export default function EditMenuItemPage() {
  const router = useRouter()
  const params = useParams()
  const itemId = params.id as string
  
  const { data: item, isLoading } = useMenuItem(itemId)
  const updateMenuItem = useUpdateMenuItem()
  const { data: categories } = useMenuCategories()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    emoji: '🍽️',
    available: true,
  })

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price?.toString() || '',
        category_id: item.category_id || '',
        emoji: item.emoji || '🍽️',
        available: item.available ?? true,
      })
    }
  }, [item])

  const emojiOptions = ['🍕', '🍔', '🍟', '🥗', '🍝', '🍜', '🍱', '🍛', '🍲', '🥘', '🍳', '🥞', '🧇', '🥓', '🍗', '🍖', '🌭', '🥪', '🌮', '🌯', '🥙', '🧆', '🍿', '🧈', '🥚', '🍞', '🥐', '🥖', '🥨', '🥯', '🧀', '🍖', '🦴', '🍤', '🦞', '🦀', '🐙', '🦑', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateMenuItem.mutateAsync({
        id: itemId,
        data: {
          ...formData,
          price: parseFloat(formData.price),
        }
      })
      router.push('/dashboard/menu')
    } catch (error) {
      console.error('Failed to update menu item:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-duo-gray flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-duo-green border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 font-bold text-gray-600">Loading item...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-duo-gray p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => router.back()} className="text-4xl hover:scale-110 transition-transform">
              ⬅️
            </button>
            <div>
              <h1 className="text-4xl font-extrabold text-duo-darkGray">Edit Menu Item</h1>
              <p className="text-lg text-gray-600">Update your dish details</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <DuoCard>
            <h3 className="text-2xl font-extrabold text-duo-darkGray mb-6">📝 Item Details</h3>
            
            <div className="space-y-4">
              {/* Emoji Selector */}
              <div>
                <label className="block text-sm font-bold text-duo-darkGray mb-3">
                  Choose an Emoji
                </label>
                <div className="grid grid-cols-10 gap-2 max-h-40 overflow-y-auto p-2 bg-duo-gray rounded-2xl">
                  {emojiOptions.map((emoji) => (
                    <motion.button
                      key={emoji}
                      type="button"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setFormData({...formData, emoji})}
                      className={`text-3xl p-2 rounded-xl transition-all ${
                        formData.emoji === emoji ? 'bg-duo-green shadow-duo' : 'hover:bg-white'
                      }`}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
                <div className="mt-3 text-center">
                  <span className="text-6xl">{formData.emoji}</span>
                </div>
              </div>

              <DuoInput
                label="Item Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />

              <div>
                <label className="block text-sm font-bold text-duo-darkGray mb-2">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-duo-lightGray focus:border-duo-blue focus:outline-none transition-colors font-medium text-duo-darkGray"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DuoInput
                  label="Price ($)"
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />

                <div>
                  <label className="block text-sm font-bold text-duo-darkGray mb-2">
                    Category
                  </label>
                  <select
                    required
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-duo-lightGray focus:border-duo-blue focus:outline-none transition-colors font-medium text-duo-darkGray"
                  >
                    <option value="">Select category</option>
                    {categories?.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData({...formData, available: e.target.checked})}
                  className="w-6 h-6 rounded-lg"
                />
                <label htmlFor="available" className="text-sm font-bold text-duo-darkGray">
                  Available for order
                </label>
              </div>
            </div>
          </DuoCard>

          <div className="flex gap-4">
            <DuoButton
              type="button"
              onClick={() => router.back()}
              variant="error"
              size="lg"
              className="flex-1"
            >
              ❌ Cancel
            </DuoButton>
            <DuoButton
              type="submit"
              disabled={updateMenuItem.isPending}
              variant="success"
              size="lg"
              className="flex-1"
            >
              {updateMenuItem.isPending ? '⏳ Updating...' : '✅ Save Changes'}
            </DuoButton>
          </div>
        </form>
      </div>
    </div>
  )
}
