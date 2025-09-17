"use client"
import * as React from "react"

type Particle = { x: number; y: number; vx: number; vy: number; size: number }

export function Particles({
  className,
  count = 60,
  color = "255,255,255",
  opacity = 0.15,
}: {
  className?: string
  count?: number
  color?: string // rgb
  opacity?: number
}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const particlesRef = React.useRef<Particle[]>([])
  const rafRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (!rect) return
      canvas.width = Math.floor(rect.width)
      canvas.height = Math.floor(rect.height)
    }
    resize()
    window.addEventListener("resize", resize)

    const rand = (min: number, max: number) => Math.random() * (max - min) + min
    particlesRef.current = new Array(count).fill(0).map(() => ({
      x: rand(0, canvas.width),
      y: rand(0, canvas.height),
      vx: rand(-0.2, 0.2),
      vy: rand(-0.2, 0.2),
      size: rand(0.5, 1.8),
    }))

    const step = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = `rgba(${color}, ${opacity})`
      const particles = particlesRef.current
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      // faint lines to nearest neighbors
      ctx.strokeStyle = `rgba(${color}, ${opacity * 0.5})`
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist2 = dx * dx + dy * dy
          if (dist2 < 120 * 120) {
            const alpha = 1 - dist2 / (120 * 120)
            ctx.globalAlpha = alpha * 0.4
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)

    return () => {
      window.removeEventListener("resize", resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [count, color, opacity])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      aria-hidden
    />
  )
}


