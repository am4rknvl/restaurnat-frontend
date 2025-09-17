"use client"
import { motion, type Variants } from "framer-motion"
import * as React from "react"

export default function ScrollTriggered() {
  return (
    <div style={container}>
      {food.map(([img, title, hueA, hueB], i) => (
        <Card i={i} image={img} title={title} hueA={hueA} hueB={hueB} key={`${title}-${i}`} />
      ))}
    </div>
  )
}

interface CardProps {
  image: string
  title: string
  hueA: number
  hueB: number
  i: number
}

function Card({ image, title, hueA, hueB, i }: CardProps) {
  const background = `linear-gradient(306deg, ${hue(hueA)}, ${hue(hueB)})`

  return (
    <motion.div
      className={`card-container-${i}`}
      style={cardContainer}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.8, once: false }}
    >
      <div style={{ ...splash, background }} />
      <motion.div style={card} variants={cardVariants} className="card">
        <div style={imageWrapper}>
          <img src={image} alt={title} style={imageStyle} />
          <div style={titleOverlay}>
            <span style={{ fontSize: 16, fontWeight: 600, color: "white" }}>{title}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const cardVariants: Variants = {
  offscreen: {
    y: 300,
  },
  onscreen: {
    y: 50,
    rotate: -10,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
}

const hue = (h: number) => `hsl(${h}, 100%, 50%)`

const container: React.CSSProperties = {
  margin: "100px auto",
  maxWidth: 900,
  paddingBottom: 100,
  width: "100%",
}

const cardContainer: React.CSSProperties = {
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  paddingTop: 20,
  marginBottom: -120,
}

const splash: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  clipPath:
    'path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")',
}

const card: React.CSSProperties = {
  width: 300,
  height: 430,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 20,
  background: "#0b1220",
  color: "#fff",
  boxShadow:
    "0 0 1px hsl(0deg 0% 0% / 0.075), 0 0 2px hsl(0deg 0% 0% / 0.075), 0 0 4px hsl(0deg 0% 0% / 0.075), 0 0 8px hsl(0deg 0% 0% / 0.075), 0 0 16px hsl(0deg 0% 0% / 0.075)",
  transformOrigin: "10% 60%",
  border: "1px solid hsl(0 0% 100% / 0.08)",
  backdropFilter: "blur(6px)",
  overflow: "hidden",
}

const imageWrapper: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
}

const imageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
}

const titleOverlay: React.CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  padding: 12,
  background: "linear-gradient(0deg, rgba(0,0,0,0.6), transparent)",
}

const food: [string, string, number, number][] = [
  ["https://unsplash.com/photos/sandwich-with-boiled-egg-fdlZBWIP0aM", "Classic Burger", 340, 10],
  ["https://unsplash.com/photos/pizza-on-chopping-board-MqT0asuoIcU", "Neapolitan Pizza", 20, 40],
  ["https://unsplash.com/photos/cooked-food-awj7sRviVXo", "Spicy Noodles", 60, 90],
  ["https://unsplash.com/photos/baked-pancakes-eeqbbemH9-c3", "Sushi Roll", 80, 120],
  ["https://unsplash.com/photos/cooked-food-awj7sRviVXo", "Tacos", 100, 140],
  ["https://unsplash.com/photos/toast-bread-with-blueberry-on-black-plate-zcUgjyqEwe8", "Ramen", 205, 245],
  ["https://unsplash.com/photos/silver-spoon-on-black-ceramic-bowl-with-vegetables-1SPu0KT-Ejg", "Fries", 260, 290],
  ["https://unsplash.com/photos/cooked-food-on-black-bowl-ZuIDLSz3XLg", "Dessert", 290, 320],
]


