import { motion } from "framer-motion"

export default function SettingsPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-4 text-muted-foreground">Notification preferences, privacy, and app behavior toggles.</p>

        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg bg-card">Email & SMS notification settings</div>
          <div className="p-6 rounded-lg bg-card">Privacy and data controls</div>
        </section>
      </motion.div>
    </main>
  )
}
