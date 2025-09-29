import { motion } from "framer-motion"
import Link from "next/link"

export default function SettingsPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="mt-2 text-muted-foreground">Notification preferences, privacy, and app behavior toggles.</p>
          </div>
          <div>
            <Link href="/profile" className="text-sm underline">View profile</Link>
          </div>
        </div>

        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg bg-card">
            <h3 className="font-semibold">Notifications</h3>
            <p className="mt-2 text-sm text-muted-foreground">Email, SMS, and in-app notifications for orders and system alerts.</p>
          </div>
          <div className="p-6 rounded-lg bg-card">
            <h3 className="font-semibold">Privacy & Security</h3>
            <p className="mt-2 text-sm text-muted-foreground">Two-factor (optional), session management, and access controls.</p>
          </div>
        </section>

        <div className="mt-8">
          <Link href="/support" className="underline">Contact support</Link>
        </div>
      </motion.div>
    </main>
  )
}
