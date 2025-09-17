import { motion } from "framer-motion"

export default function OrdersHistoryPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold">Order History & Status</h1>
        <p className="mt-4 text-muted-foreground">Track active orders in real-time, view past receipts, and reorder favorite items quickly.</p>

        <section className="mt-8 space-y-4">
          <div className="p-4 rounded-lg bg-card">Sample order • Pizza • Delivered • $18.00</div>
          <div className="p-4 rounded-lg bg-card">Sample order • Burger • Delivering • $12.50</div>
        </section>
      </motion.div>
    </main>
  )
}
