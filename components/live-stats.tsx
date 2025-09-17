"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import React, { useEffect, useRef } from "react"

function useAnimatedNumber(value: number, duration = 1.6) {
  const ref = useRef<HTMLSpanElement | null>(null)
  useEffect(() => {
    if (!ref.current) return
    const node = ref.current
    const motionVal = useMotionValue(0)
    const controls = animate(motionVal, value, { duration })
    const unsubscribe = motionVal.onChange((v) => {
      node.textContent = Math.floor(v).toLocaleString()
    })
    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [value, duration])
  return ref
}

export function LiveStats() {
  const aRef = useAnimatedNumber(25000)
  const bRef = useAnimatedNumber(500)
  const cRef = useAnimatedNumber(120000)
  const dRef = useAnimatedNumber(49)

  return (
    <section className="py-12 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 bg-card rounded-lg">
            <div className="text-3xl font-bold text-primary"><span ref={aRef}>0</span>+</div>
            <div className="text-sm text-muted-foreground mt-2">Customers Served</div>
          </div>
          <div className="p-6 bg-card rounded-lg">
            <div className="text-3xl font-bold text-primary"><span ref={bRef}>0</span>+</div>
            <div className="text-sm text-muted-foreground mt-2">Partner Restaurants</div>
          </div>
          <div className="p-6 bg-card rounded-lg">
            <div className="text-3xl font-bold text-primary"><span ref={cRef}>0</span>+</div>
            <div className="text-sm text-muted-foreground mt-2">Orders Delivered</div>
          </div>
          <div className="p-6 bg-card rounded-lg">
            <div className="text-3xl font-bold text-primary"><span ref={dRef}>0</span>★</div>
            <div className="text-sm text-muted-foreground mt-2">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  )
}
