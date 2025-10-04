'use client'

import { useMenuItems, useMenuCategories, useUpdateMenuItemAvailability } from '@/lib/hooks/use-menu'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { DuoCard } from '@/components/ui/duo-card'
import { DuoButton } from '@/components/ui/duo-button'

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const { data: categories } = useMenuCategories()
  const { data: items, isLoading } = useMenuItems({ 
    category: selectedCategory || undefined 
  })
  const updateAvailability = useUpdateMenuItemAvailability()

  const handleToggleAvailability = async (itemId: string, currentAvailability: boolean) => {
    try {
      await updateAvailability.mutateAsync({
        id: itemId,
        available: !currentAvailability,
      })
    } catch (error) {
      console.error('Failed to update availability:', error)
    }
  }

  return (
    <div className="min-h-screen bg-duo-gray p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="text-5xl">📋</div>
            <div>
              <h1 className="text-4xl font-extrabold text-duo-darkGray">Menu Manager</h1>
              <p className="text-lg text-gray-600">Manage your delicious offerings</p>
            </div>
          </div>
          <DuoButton variant="primary" size="lg">
            ➕ Add New Item
          </DuoButton>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory('')}
              className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedCategory === '' 
                  ? 'bg-duo-green text-white shadow-duo' 
                  : 'bg-white text-duo-darkGray hover:bg-duo-lightGray'
              }`}
            >
              🍽️ All Items
            </motion.button>
            {categories?.map((category: any) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${
                  selectedCategory === category.id 
                    ? 'bg-duo-green text-white shadow-duo' 
                    : 'bg-white text-duo-darkGray hover:bg-duo-lightGray'
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-duo-green border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 font-bold text-gray-600">Loading menu items...</p>
          </div>
        ) : items && items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item: any, index: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <DuoCard>
                  {/* Item Image Placeholder */}
                  <div className="w-full h-40 bg-gradient-to-br from-duo-yellow to-duo-green rounded-2xl mb-4 flex items-center justify-center">
                    <span className="text-6xl">{item.emoji || '🍽️'}</span>
                  </div>

                  {/* Item Info */}
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-extrabold text-duo-darkGray flex-1">
                        {item.name}
                      </h3>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggleAvailability(item.id, item.available)}
                        className={`ml-2 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          item.available
                            ? 'bg-duo-success text-white'
                            : 'bg-duo-error text-white'
                        }`}
                      >
                        {item.available ? '✅ Available' : '❌ Out'}
                      </motion.button>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description || 'Delicious menu item'}
                    </p>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-extrabold text-duo-green">
                      ${item.price?.toFixed(2) || '0.00'}
                    </div>
                    <DuoButton variant="secondary" size="sm">
                      ✏️ Edit
                    </DuoButton>
                  </div>
                </DuoCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <DuoCard hover={false}>
            <div className="text-center py-12">
              <div className="text-8xl mb-4">🍳</div>
              <h3 className="text-2xl font-extrabold text-duo-darkGray mb-2">
                No menu items yet
              </h3>
              <p className="text-gray-600 mb-6">Start building your menu!</p>
              <DuoButton variant="primary" size="lg">
                ➕ Add Your First Item
              </DuoButton>
            </div>
          </DuoCard>
        )}
      </div>
    </div>
  )
}
