import { motion } from "framer-motion"
import Link from "next/link"

export default function ProductsPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold">Browse Products & Services</h1>
        <p className="mt-4 text-muted-foreground">Explore menus, filter by cuisine, and view detailed item pages with photos, ingredients, and dietary labels.</p>

        <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="p-6 rounded-lg bg-card">
            <h3 className="font-semibold">Rich product cards</h3>
            <p className="mt-2 text-sm text-muted-foreground">High-resolution images, modifiers, options (size, spice level), and add-ons with live pricing.</p>
          </article>
          <article className="p-6 rounded-lg bg-card">
            <h3 className="font-semibold">Search & filters</h3>
            <p className="mt-2 text-sm text-muted-foreground">Filter by cuisine, dietary needs, and partner restaurant. Sort by popularity or delivery time.</p>
          </article>
          <article className="p-6 rounded-lg bg-card">
            <h3 className="font-semibold">Partner integration</h3>
            <p className="mt-2 text-sm text-muted-foreground">Pull dynamic menus from partner APIs and sync availability in real-time.</p>
          </article>
        </section>

        <div className="mt-8">
          <Link href="/orders" className="underline">Go to Orders →</Link>
        </div>
      </motion.div>
    </main>
  )
}
