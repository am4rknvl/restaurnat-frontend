import { motion } from "framer-motion"

export default function ProfilePage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold">Profile & Account</h1>
        <p className="mt-4 text-muted-foreground">Update name, email, phone, and delivery addresses. Manage saved payment methods and preferences.</p>

        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg bg-card">Personal info, connected accounts, and security settings.</div>
          <div className="p-6 rounded-lg bg-card">Addresses, saved locations, and preferred delivery windows.</div>
        </section>
      </motion.div>
    </main>
  )
}
