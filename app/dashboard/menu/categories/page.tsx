'use client'

import { useState } from 'react'
import { useMenuCategories } from '@/lib/hooks/use-menu'
import { apiClient } from '@/lib/api/client'
import { motion } from 'framer-motion'
import { DuoCard } from '@/components/ui/duo-card'
import { DuoButton } from '@/components/ui/duo-button'
import { DuoInput } from '@/components/ui/duo-input'
import { useQueryClient } from '@tanstack/react-query'

export default function CategoriesPage() {
  const { data: categories, isLoading } = useMenuCategories()
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    emoji: '🍽️',
  })

  const emojiOptions = ['🍕', '🍔', '🍟', '🥗', '🍝', '🍜', '🍱', '🍛', '🍲', '🥘', '🍳', '🥞', '🧇', '🥓', '🍗', '🍖', '🌭', '🥪', '🌮', '🌯', '🥙', '🧆', '🍿', '🧈', '🥚', '🍞', '🥐', '🥖', '🥨', '🥯', '🧀', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '☕', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🥤', '🧃']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await apiClient.menu.categories.update(editingId, formData)
      } else {
        await apiClient.menu.categories.create(formData)
      }
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] })
      setShowForm(false)
      setEditingId(null)
      setFormData({ name: '', description: '', emoji: '🍽️' })
    } catch (error) {
      console.error('Failed to save category:', error)
    }
  }

  const handleEdit = (category: any) => {
    setFormData({
      name: category.name,
      description: category.description || '',
      emoji: category.emoji || '🍽️',
    })
    setEditingId(category.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await apiClient.menu.categories.delete(id)
        queryClient.invalidateQueries({ queryKey: ['menu-categories'] })
      } catch (error) {
        console.error('Failed to delete category:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-duo-gray p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="text-5xl">📂</div>
            <div>
              <h1 className="text-4xl font-extrabold text-duo-darkGray">Categories</h1>
              <p className="text-lg text-gray-600">Organize your menu</p>
            </div>
          </div>
          <DuoButton 
            onClick={() => {
              setShowForm(!showForm)
              setEditingId(null)
              setFormData({ name: '', description: '', emoji: '🍽️' })
            }} 
            variant="primary" 
            size="lg"
          >
            {showForm ? '❌ Cancel' : '➕ Add Category'}
          </DuoButton>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <DuoCard>
              <h3 className="text-2xl font-extrabold text-duo-darkGray mb-6">
                {editingId ? '✏️ Edit Category' : '➕ New Category'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-duo-darkGray mb-3">
                    Choose an Emoji
                  </label>
                  <div className="grid grid-cols-10 gap-2 max-h-32 overflow-y-auto p-2 bg-duo-gray rounded-2xl">
                    {emojiOptions.map((emoji) => (
                      <motion.button
                        key={emoji}
                        type="button"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setFormData({...formData, emoji})}
                        className={`text-2xl p-2 rounded-xl transition-all ${
                          formData.emoji === emoji ? 'bg-duo-green shadow-duo' : 'hover:bg-white'
                        }`}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-5xl">{formData.emoji}</span>
                  </div>
                </div>

                <DuoInput
                  label="Category Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Appetizers, Main Course, Desserts"
                />

                <div>
                  <label className="block text-sm font-bold text-duo-darkGray mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Brief description of this category..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-duo-lightGray focus:border-duo-blue focus:outline-none transition-colors font-medium text-duo-darkGray"
                  />
                </div>

                <DuoButton type="submit" variant="success" size="lg" className="w-full">
                  {editingId ? '✅ Update Category' : '✅ Create Category'}
                </DuoButton>
              </form>
            </DuoCard>
          </motion.div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-duo-green border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 font-bold text-gray-600">Loading categories...</p>
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category: any, index: number) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <DuoCard>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-5xl">{category.emoji || '📂'}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-extrabold text-duo-darkGray">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-gray-600">{category.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <DuoButton 
                      onClick={() => handleEdit(category)} 
                      variant="secondary" 
                      size="sm"
                      className="flex-1"
                    >
                      ✏️ Edit
                    </DuoButton>
                    <DuoButton 
                      onClick={() => handleDelete(category.id)} 
                      variant="error" 
                      size="sm"
                      className="flex-1"
                    >
                      🗑️ Delete
                    </DuoButton>
                  </div>
                </DuoCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <DuoCard hover={false}>
            <div className="text-center py-12">
              <div className="text-8xl mb-4">📂</div>
              <h3 className="text-2xl font-extrabold text-duo-darkGray mb-2">
                No categories yet
              </h3>
              <p className="text-gray-600 mb-6">Create your first category to organize your menu!</p>
              <DuoButton 
                onClick={() => setShowForm(true)} 
                variant="primary" 
                size="lg"
              >
                ➕ Create First Category
              </DuoButton>
            </div>
          </DuoCard>
        )}
      </div>
    </div>
  )
}
