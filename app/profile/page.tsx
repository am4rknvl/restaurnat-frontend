import { motion } from "framer-motion"
import Link from "next/link"

export default function ProfilePage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile & Account</h1>
            <p className="mt-2 text-muted-foreground">Update name, email, phone, and delivery addresses. Manage saved payment methods and preferences.</p>
          </div>
          <div>
            <Link href="/settings" className="text-sm underline">Open settings</Link>
          </div>
        </div>

        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg bg-card">
            <h3 className="font-semibold">Personal info</h3>
            <p className="mt-2 text-sm text-muted-foreground">Name: —<br/>Email: —</p>
          </div>
          <div className="p-6 rounded-lg bg-card">
            <h3 className="font-semibold">Delivery preferences</h3>
            <p className="mt-2 text-sm text-muted-foreground">Saved addresses, default delivery time, and preferred partners.</p>
          </div>
        </section>
      </motion.div>
    </main>
  )
}
