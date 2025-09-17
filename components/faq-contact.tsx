"use client"

import React from "react"

export function FAQ() {
  const items = [
    { q: "Where do you deliver?", a: "We deliver in supported cities and suburbs. Check availability at checkout." },
    { q: "What are the fees?", a: "Delivery starts at $2.99, fees vary by distance and partner." },
    { q: "How to partner my restaurant?", a: "Contact sales@restaurantos.com or use the Partner with us form." },
  ]

  return (
    <section id="faq" className="py-12 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-semibold mb-6">FAQ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((it) => (
            <details key={it.q} className="p-4 bg-card rounded-lg">
              <summary className="font-medium">{it.q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ContactForm() {
  return (
    <section id="contact" className="py-12 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-semibold mb-6">Contact Us</h3>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input aria-label="Name" placeholder="Your name" className="p-3 rounded-lg bg-card" />
          <input aria-label="Email" placeholder="Your email" className="p-3 rounded-lg bg-card" />
          <input aria-label="Subject" placeholder="Subject" className="p-3 rounded-lg bg-card md:col-span-2" />
          <textarea aria-label="Message" placeholder="Message" className="p-3 rounded-lg bg-card md:col-span-2 h-36" />
          <button type="submit" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground md:col-span-2">Send Message</button>
        </form>
      </div>
    </section>
  )
}
