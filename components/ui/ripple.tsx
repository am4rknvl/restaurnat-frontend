"use client"
import * as React from "react"

export function useRipple() {
  const ref = React.useRef<HTMLButtonElement | null>(null)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const handler = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const ripple = document.createElement("span")
      const size = Math.max(rect.width, rect.height)
      ripple.style.position = "absolute"
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`
      ripple.style.width = `${size}px`
      ripple.style.height = `${size}px`
      ripple.style.borderRadius = "9999px"
      ripple.style.pointerEvents = "none"
      ripple.style.background = "rgba(255,255,255,0.25)"
      ripple.style.transform = "scale(0)"
      ripple.style.transition = "transform 400ms ease, opacity 600ms ease"
      el.style.position = "relative"
      el.style.overflow = "hidden"
      el.appendChild(ripple)
      requestAnimationFrame(() => {
        ripple.style.transform = "scale(1)"
        ripple.style.opacity = "0"
      })
      setTimeout(() => ripple.remove(), 650)
    }
    el.addEventListener("click", handler)
    return () => el.removeEventListener("click", handler)
  }, [])
  return ref
}


