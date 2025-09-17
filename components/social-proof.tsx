"use client"

import React from "react"

const logos = [
  "/placeholder-logo.png",
  "/placeholder-logo.svg",
  "/placeholder-user.jpg",
  "https://source.unsplash.com/collection/542909/200x200",
]

export function SocialProof() {
  return (
    <section className="py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-muted-foreground">Trusted by 500+ food lovers daily</p>
        <div className="mt-6 flex items-center justify-center gap-6 flex-wrap">
          {logos.map((src, idx) => (
            <img key={idx} src={src} alt={`Partner ${idx + 1}`} className="h-10 w-28 object-contain" loading="lazy" />
          ))}
        </div>
      </div>
    </section>
  )
}
