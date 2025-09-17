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

            <motion.h1
              className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
            >
              Run Your Restaurant <span className="text-primary">Smarter</span>
            </motion.h1>

            <motion.p
              className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto text-pretty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
            >
              Streamline operations with our all-in-one platform. Handle reservations, orders, staff, and analytics
              from one powerful dashboard.
            </motion.p>

            <motion.div
              className="mt-10 flex items-center justify-center gap-x-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
            >
              <Magnetic>
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link href="/signup" ref={rippleRef as any}>Get Started</Link>
                </Button>
              </Magnetic>
              <Magnetic>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="group text-lg px-8 py-6 bg-transparent transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <Link href="#features" ref={rippleRef as any}>
                    <span className="mr-2">Learn More</span>
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5"
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </motion.svg>
                  </Link>
                </Button>
              </Magnetic>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
