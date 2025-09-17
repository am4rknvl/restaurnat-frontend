"use client"

import React from "react"
import { motion } from "framer-motion"

const reviews = [
  { id: 1, name: "Sofia R.", text: "Quick delivery and the food was still hot — absolutely delicious!", rating: 5, avatar: "/placeholder-user.jpg" },
  { id: 2, name: "Marcus P.", text: "Great selection of local restaurants and accurate ETAs.", rating: 5, avatar: "/placeholder-user.jpg" },
]

export function Testimonials() {
  return (
    <section className="py-12 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold">What our customers say</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((r, i) => (
            <motion.blockquote key={r.id} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="p-6 bg-card rounded-lg">
              <div className="flex items-center gap-4">
                <img src={r.avatar} alt={r.name} className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <strong>{r.name}</strong>
                  <div className="text-sm text-muted-foreground">{'★'.repeat(r.rating)}</div>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">{r.text}</p>
            </motion.blockquote>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="mx-auto max-w-2xl">
            <div className="aspect-video bg-black/20 rounded-lg overflow-hidden">
              {/* Video testimonial placeholder */}
              <img src="https://source.unsplash.com/collection/542909/1200x675" alt="Video testimonial" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
