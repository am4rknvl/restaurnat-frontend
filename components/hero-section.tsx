"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Particles } from "@/components/ui/particles"
import { Magnetic } from "@/components/ui/magnetic"
import { useRipple } from "@/components/ui/ripple"
import * as React from "react"

export function HeroSection() {
  const rippleRef = useRipple()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 100, damping: 20 })
  const smoothY = useSpring(mouseY, { stiffness: 100, damping: 20 })

  const translateOrb1X = useTransform(smoothX, [0, 1], [0, -10])
  const translateOrb1Y = useTransform(smoothY, [0, 1], [0, 10])
  const translateOrb2X = useTransform(smoothX, [0, 1], [0, 12])
  const translateOrb2Y = useTransform(smoothY, [0, 1], [0, -8])

  const onMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - left) / width
    const y = (e.clientY - top) / height
    mouseX.set(x)
    mouseY.set(y)
  }, [mouseX, mouseY])

  return (
    <section className="relative overflow-hidden py-24 lg:py-40">
      <Particles className="-z-10" count={70} opacity={0.12} />
      <motion.div
        className="absolute inset-0 -z-10"
        aria-hidden
        animate={{ opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 12, repeat: Infinity }}
        style={{
          background:
            "radial-gradient(1200px 600px at 20% 10%, hsl(24 100% 50% / 0.15), transparent 60%), radial-gradient(1000px 500px at 80% 20%, hsl(210 100% 60% / 0.12), transparent 60%), radial-gradient(900px 500px at 50% 80%, hsl(140 100% 50% / 0.10), transparent 60%)",
        }}
      />

      <div onMouseMove={onMouseMove} className="relative">
        <motion.div
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full blur-3xl"
          style={{
            background: "linear-gradient(135deg, hsl(24 100% 50% / 0.5), hsl(0 0% 100% / 0.1))",
            x: translateOrb1X,
            y: translateOrb1Y,
          }}
        />
        <motion.div
          className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full blur-3xl"
          style={{
            background: "linear-gradient(135deg, hsl(210 100% 60% / 0.4), hsl(0 0% 100% / 0.08))",
            x: translateOrb2X,
            y: translateOrb2Y,
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/60 px-4 py-2 text-sm backdrop-blur">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                Trusted by modern restaurants
              </div>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-left lg:pr-8">
                <motion.h1
                  className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06, duration: 0.6 }}
                >
                  Order from your favorite restaurants in minutes.
                </motion.h1>

                <motion.p
                  className="mt-4 text-lg leading-7 text-muted-foreground max-w-2xl"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.6 }}
                >
                  Fast delivery, real-time tracking, and rewards with every bite. Fresh, sizzling, mouthwatering meals
                  delivered to your door.
                </motion.p>

                <motion.div className="mt-6 flex flex-wrap items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <a href="#" aria-label="App Store" className="inline-flex items-center bg-black/80 text-white px-4 py-3 rounded-lg shadow hover:translate-y-[-2px] transition-transform">
                    <svg className="h-6 w-6 mr-3" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <rect width="24" height="24" rx="4" fill="#fff" opacity="0.08" />
                    </svg>
                    <span className="text-sm">Download on the</span>
                    <strong className="ml-2">App Store</strong>
                  </a>

                  <a href="#" aria-label="Google Play" className="inline-flex items-center bg-white/6 text-white px-4 py-3 rounded-lg shadow hover:translate-y-[-2px] transition-transform">
                    <svg className="h-6 w-6 mr-3" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <rect width="24" height="24" rx="4" fill="#fff" opacity="0.08" />
                    </svg>
                    <span className="text-sm">Get it on</span>
                    <strong className="ml-2">Google Play</strong>
                  </a>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative mx-auto w-full max-w-md">
                <div className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-tr from-black/30 to-black/10">
                  <img src="https://source.unsplash.com/collection/542909/800x900" alt="Food and phone mockup" className="w-full h-[480px] object-cover" loading="lazy" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
