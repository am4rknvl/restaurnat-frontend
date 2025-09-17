"use client"

import React from "react"
import { motion } from "framer-motion"

const dishes = [
  { id: 1, title: "Sizzling Burger", image: "https://source.unsplash.com/collection/190727/600x400" },
  { id: 2, title: "Neapolitan Pizza", image: "https://source.unsplash.com/collection/190727/601x400" },
  { id: 3, title: "Ethiopian Feast", image: "https://source.unsplash.com/collection/190727/602x400" },
  { id: 4, title: "Decadent Dessert", image: "https://source.unsplash.com/collection/190727/603x400" },
]

export function MenuCarousel() {
  return (
    <section className="py-12 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold">Menu Preview</h3>
          <p className="text-sm text-muted-foreground">Burgers · Pizza · Ethiopian · Desserts</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {dishes.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-lg overflow-hidden bg-card shadow">
              <img src={d.image} alt={d.title} className="w-full h-44 object-cover" loading="lazy" />
              <div className="p-4">
                <h4 className="font-semibold">{d.title}</h4>
                <p className="text-sm text-muted-foreground">Mouthwatering, made fresh to order.</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
