"use client"

import React from "react"
import { motion } from "framer-motion"

export function HowItWorks() {
  return (
    <section id="how" className="py-12 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-semibold">How it works</h3>
          <p className="text-sm text-muted-foreground">Three simple steps from craving to doorstep.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} className="p-6 bg-card rounded-lg text-center">
            <div className="text-4xl">1</div>
            <h4 className="mt-4 font-semibold">Browse</h4>
            <p className="text-sm text-muted-foreground mt-2">Find dishes and restaurants with rich menus and photos.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} className="p-6 bg-card rounded-lg text-center">
            <div className="text-4xl">2</div>
            <h4 className="mt-4 font-semibold">Order</h4>
            <p className="text-sm text-muted-foreground mt-2">Add to cart, choose delivery or pickup, and pay securely.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} className="p-6 bg-card rounded-lg text-center">
            <div className="text-4xl">3</div>
            <h4 className="mt-4 font-semibold">Enjoy</h4>
            <p className="text-sm text-muted-foreground mt-2">Track your order in real-time and savor the meal when it arrives.</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
