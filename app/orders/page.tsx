import { motion } from "framer-motion"
import Link from "next/link"

export default function OrdersPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold">Place New Orders</h1>
        <p className="mt-4 text-muted-foreground">Build carts, choose delivery/pickup options, schedule for later, and apply promo codes with live totals.</p>

        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="p-6 rounded-lg bg-card">
            <h3 className="font-semibold">Smart cart</h3>
            <p className="mt-2 text-sm text-muted-foreground">Auto-calculated taxes, fees, and delivery estimates. Suggest best combos and upsells.</p>
          </article>
          <article className="p-6 rounded-lg bg-card">
            <h3 className="font-semibold">Checkout & payment</h3>
            <p className="mt-2 text-sm text-muted-foreground">Support for cards, wallets, and in-app credits. Securely tokenized payment flows.</p>
          </article>
        </section>

        <div className="mt-8">
          <Link href="/orders/history" className="underline">View order history →</Link>
        </div>
      </motion.div>
    </main>
  )
}
