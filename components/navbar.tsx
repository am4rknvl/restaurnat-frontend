"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import { Magnetic } from "@/components/ui/magnetic"

export function Navbar() {
  const { scrollY } = useScroll()
  const bgOpacity = useTransform(scrollY, [0, 80], [0.6, 0.95])

  return (
    <motion.nav
      style={{ backgroundColor: "hsl(var(--background) / var(--tw-bg-opacity))", opacity: bgOpacity as any }}
      className="border-b border-border/40 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">R</span>
              </div>
              <span className="font-bold text-xl">RestaurantOS</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                Products
              </Link>
              <Link href="/orders" className="text-muted-foreground hover:text-foreground transition-colors">
                Orders
              </Link>
              <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                Profile
              </Link>
              <Link href="/settings" className="text-muted-foreground hover:text-foreground transition-colors">
                Settings
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Magnetic>
              <Button asChild variant="outline">
                <Link href="/login">Sign In</Link>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </Magnetic>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
