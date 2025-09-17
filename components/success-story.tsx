"use client"

import React from "react"

export function SuccessStory() {
  return (
    <section className="py-12 lg:py-20 bg-muted/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-2xl font-semibold">Partner success: 200% growth</h3>
            <p className="mt-4 text-muted-foreground">See how a local partner doubled their online orders within 6 months by using our platform.</p>
            <ul className="mt-6 space-y-2">
              <li className="text-sm">• Integrated menu and promotions</li>
              <li className="text-sm">• Real-time availability and prep optimization</li>
              <li className="text-sm">• Targeted marketing and loyalty rewards</li>
            </ul>
          </div>
          <div>
            <div className="rounded-lg overflow-hidden bg-card">
              <img src="https://source.unsplash.com/collection/542909/800x500" alt="Partner growth" className="w-full h-64 object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
