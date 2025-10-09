'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMenuCategories, useCreateMenuItem } from '@/lib/hooks/use-menu'
import { RouteGuard } from '@/lib/auth/route-guard'
import { motion } from 'framer-motion'
import { DuoCard } from '@/components/ui/duo-card'
import { DuoButton } from '@/components/ui/duo-button'
import { DuoInput } from '@/components/ui/duo-input'

function AddMenuItemPageContent() {
  const router = useRouter()
  const createMenuItem = useCreateMenuItem()
  const { data: categories } = useMenuCategories()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    emoji: '🍽️',
    available: true,
    variants: [] as any[],
    addons: [] as any[],
  })

  const [newVariant, setNewVariant] = useState({ name: '', price: '' })
  const [newAddon, setNewAddon] = useState({ name: '', price: '' })

  const emojiOptions = ['🍕', '🍔', '🍟', '🥗', '🍝', '🍜', '🍱', '🍛', '🍲', '🥘', '🍳', '🥞', '🧇', '🥓', '🍗', '🍖', '🌭', '🥪', '🌮', '🌯', '🥙', '🧆', '🍿', '🧈', '🥚', '🍞', '🥐', '🥖', '🥨', '🥯', '🧀', '🍖', '🦴', '🍤', '🦞', '🦀', '🐙', '🦑', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🥤', '🧃', '🧉', '🧊']

  const addVariant = () => {
    if (newVariant.name && newVariant.price) {
      setFormData({
        ...formData,
        variants: [...formData.variants, { ...newVariant, price: parseFloat(newVariant.price) }]
      })
      setNewVariant({ name: '', price: '' })
    }
  }

  const removeVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index)
    })
  }

  const addAddon = () => {
    if (newAddon.name && newAddon.price) {
      setFormData({
        ...formData,
        addons: [...formData.addons, { ...newAddon, price: parseFloat(newAddon.price) }]
      })
      setNewAddon({ name: '', price: '' })
    }
  }

  const removeAddon = (index: number) => {
    setFormData({
      ...formData,
      addons: formData.addons.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createMenuItem.mutateAsync({
        ...formData,
        price: parseFloat(formData.price),
      })
      router.push('/dashboard/menu')
    } catch (error) {
      console.error('Failed to create menu item:', error)
    }
  }

  return (
    <div className="min-h-screen bg-duo-gray p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => router.back()} className="text-4xl hover:scale-110 transition-transform">
              ⬅️
            </button>
            <div>
              <h1 className="text-4xl font-extrabold text-duo-darkGray">Add Menu Item</h1>
              <p className="text-lg text-gray-600">Create a delicious new dish!</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <DuoCard>
            <h3 className="text-2xl font-extrabold text-duo-darkGray mb-6">📝 Basic Info</h3>
            
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
                placeholder="Delicious Pizza"
              />

              <div>
                <label className="block text-sm font-bold text-duo-darkGray mb-2">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your amazing dish..."
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
                  placeholder="9.99"
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

          {/* Variants */}
          <DuoCard>
            <h3 className="text-2xl font-extrabold text-duo-darkGray mb-6">🔀 Variants (Optional)</h3>
            <p className="text-sm text-gray-600 mb-4">Add size options like Small, Medium, Large</p>

            <div className="space-y-4">
              {formData.variants.map((variant, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 bg-duo-gray rounded-2xl"
                >
                  <div className="flex-1">
                    <span className="font-bold text-duo-darkGray">{variant.name}</span>
                    <span className="ml-3 text-duo-green font-bold">+${variant.price.toFixed(2)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-duo-error text-2xl hover:scale-110 transition-transform"
                  >
                    ❌
                  </button>
                </motion.div>
              ))}

              <div className="flex gap-3">
                <DuoInput
                  placeholder="Variant name (e.g., Large)"
                  value={newVariant.name}
                  onChange={(e) => setNewVariant({...newVariant, name: e.target.value})}
                  className="flex-1"
                />
                <DuoInput
                  type="number"
                  step="0.01"
                  placeholder="Extra price"
                  value={newVariant.price}
                  onChange={(e) => setNewVariant({...newVariant, price: e.target.value})}
                  className="w-32"
                />
                <DuoButton type="button" onClick={addVariant} variant="secondary" size="md">
                  ➕ Add
                </DuoButton>
              </div>
            </div>
          </DuoCard>

          {/* Addons */}
          <DuoCard>
            <h3 className="text-2xl font-extrabold text-duo-darkGray mb-6">➕ Add-ons (Optional)</h3>
            <p className="text-sm text-gray-600 mb-4">Extra toppings, sides, or customizations</p>

            <div className="space-y-4">
              {formData.addons.map((addon, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 bg-duo-gray rounded-2xl"
                >
                  <div className="flex-1">
                    <span className="font-bold text-duo-darkGray">{addon.name}</span>
                    <span className="ml-3 text-duo-green font-bold">+${addon.price.toFixed(2)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAddon(index)}
                    className="text-duo-error text-2xl hover:scale-110 transition-transform"
                  >
                    ❌
                  </button>
                </motion.div>
              ))}

              <div className="flex gap-3">
                <DuoInput
                  placeholder="Add-on name (e.g., Extra Cheese)"
                  value={newAddon.name}
                  onChange={(e) => setNewAddon({...newAddon, name: e.target.value})}
                  className="flex-1"
                />
                <DuoInput
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={newAddon.price}
                  onChange={(e) => setNewAddon({...newAddon, price: e.target.value})}
                  className="w-32"
                />
                <DuoButton type="button" onClick={addAddon} variant="secondary" size="md">
                  ➕ Add
                </DuoButton>
              </div>
            </div>
          </DuoCard>

          {/* Submit */}
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
              disabled={createMenuItem.isPending}
              variant="success"
              size="lg"
              className="flex-1"
            >
              {createMenuItem.isPending ? '⏳ Creating...' : '✅ Create Menu Item'}
            </DuoButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AddMenuItemPage() {
  return (
    <RouteGuard requiredRoles={['manager', 'admin']}>
      <AddMenuItemPageContent />
    </RouteGuard>
  )
}
