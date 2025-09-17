"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

type PartnerItem = {
  id: string
  title: string
  image: string
  url?: string
}

const FALLBACK: PartnerItem[] = [
  { id: "1", title: "Classic Burger", image: "https://source.unsplash.com/collection/190727/800x600" },
  { id: "2", title: "Neapolitan Pizza", image: "https://source.unsplash.com/collection/190727/801x600" },
  { id: "3", title: "Spicy Noodles", image: "https://source.unsplash.com/collection/190727/802x600" },
  { id: "4", title: "Sushi Roll", image: "https://source.unsplash.com/collection/190727/803x600" },
  { id: "5", title: "Tacos", image: "https://source.unsplash.com/collection/190727/804x600" },
]

export function PartnerFeed() {
  const [items, setItems] = useState<PartnerItem[]>(FALLBACK)
  const [loading, setLoading] = useState(false)

  const FEED_URL = process.env.NEXT_PUBLIC_PARTNERS_FEED_URL || "/api/partners"

  useEffect(() => {
    let mounted = true
    const fetchFeed = async () => {
      setLoading(true)
      try {
        const res = await fetch(FEED_URL)
        if (!res.ok) throw new Error("No feed")
        const data = await res.json()
        if (!mounted) return
        // expect data to be array of { id, title, image, url }
        if (Array.isArray(data) && data.length > 0) {
          setItems(data)
        }
      } catch (err) {
        // keep fallback
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchFeed()
    const id = setInterval(fetchFeed, 60_000) // refresh every 60s
    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [FEED_URL])

  return (
    <section className="py-12 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <h3 className="text-2xl font-semibold">Trending from our partners</h3>
          <p className="mt-2 text-muted-foreground">Fresh picks from partner restaurants — updated regularly.</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((it, idx) => (
            <motion.a
              key={it.id}
              href={it.url || "#"}
              target={it.url ? "_blank" : undefined}
              rel={it.url ? "noopener noreferrer" : undefined}
              className="relative block overflow-hidden rounded-lg shadow-lg bg-card"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.45, delay: idx * 0.03 }}
            >
              <div className="relative h-40 w-full">
                <Image src={it.image} alt={it.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
              <div className="absolute left-0 right-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                <h4 className="text-sm font-semibold text-white truncate">{it.title}</h4>
              </div>
            </motion.a>
          ))}
        </div>

        {loading && <p className="mt-4 text-sm text-muted-foreground">Refreshing feed...</p>}
      </div>
    </section>
  )
}
