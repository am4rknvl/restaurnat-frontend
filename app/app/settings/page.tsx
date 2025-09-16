import { SettingsView } from "@/components/dashboard/settings-view"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your restaurant settings and preferences.</p>
      </div>
      <SettingsView />
    </div>
  )
}
