import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

export function SettingsView() {
  const { toast } = useToast()
  const [savingInfo, setSavingInfo] = useState(false)
  const [savingHours, setSavingHours] = useState(false)
  const [updatingPassword, setUpdatingPassword] = useState(false)

  const saveInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = {
      name: String(form.get('restaurant-name') || ''),
      phone: String(form.get('phone') || ''),
      address: String(form.get('address') || ''),
      email: String(form.get('email') || ''),
    }
    try {
      setSavingInfo(true)
      await apiClient.request<any>('/api/v1/settings/restaurant', { method: 'PUT', body: JSON.stringify(payload) } as any)
      toast({ title: 'Saved', description: 'Restaurant information updated.' })
    } catch (e: any) {
      toast({ title: 'Failed', description: e.message || 'Could not save info' })
    } finally {
      setSavingInfo(false)
    }
  }

  const saveHours = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = {
      open_time: String(form.get('open-time') || ''),
      close_time: String(form.get('close-time') || ''),
    }
    try {
      setSavingHours(true)
      await apiClient.request<any>('/api/v1/settings/hours', { method: 'PUT', body: JSON.stringify(payload) } as any)
      toast({ title: 'Updated', description: 'Operating hours updated.' })
    } catch (e: any) {
      toast({ title: 'Failed', description: e.message || 'Could not update hours' })
    } finally {
      setSavingHours(false)
    }
  }

  const updatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = {
      current_password: String(form.get('current-password') || ''),
      new_password: String(form.get('new-password') || ''),
    }
    try {
      setUpdatingPassword(true)
      await apiClient.request<any>('/api/v1/auth/password', { method: 'PUT', body: JSON.stringify(payload) } as any)
      toast({ title: 'Password updated' })
    } catch (e: any) {
      toast({ title: 'Failed', description: e.message || 'Could not update password' })
    } finally {
      setUpdatingPassword(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Restaurant Information</CardTitle>
          <CardDescription>Update your restaurant's basic information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={saveInfo}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="restaurant-name">Restaurant Name</Label>
                <Input name="restaurant-name" id="restaurant-name" defaultValue="The Golden Fork" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input name="phone" id="phone" defaultValue="(555) 123-4567" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input name="address" id="address" defaultValue="123 Main Street, San Francisco, CA 94102" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input name="email" id="email" type="email" defaultValue="contact@goldenfork.com" />
            </div>
            <Button type="submit" disabled={savingInfo}>{savingInfo ? 'Saving...' : 'Save Changes'}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Operating Hours</CardTitle>
          <CardDescription>Set your restaurant's operating schedule</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={saveHours}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="open-time">Opening Time</Label>
                <Input name="open-time" id="open-time" type="time" defaultValue="11:00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="close-time">Closing Time</Label>
                <Input name="close-time" id="close-time" type="time" defaultValue="22:00" />
              </div>
            </div>
            <Button type="submit" disabled={savingHours}>{savingHours ? 'Updating...' : 'Update Hours'}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Orders</Label>
              <p className="text-sm text-muted-foreground">Get notified when new orders are placed</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Reservations</Label>
              <p className="text-sm text-muted-foreground">Get notified about new reservations</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Staff Updates</Label>
              <p className="text-sm text-muted-foreground">Get notified about staff check-ins and updates</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Daily Reports</Label>
              <p className="text-sm text-muted-foreground">Receive daily performance reports via email</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={updatePassword}>
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input name="current-password" id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input name="new-password" id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input name="confirm-password" id="confirm-password" type="password" />
            </div>
            <Button type="submit" disabled={updatingPassword}>{updatingPassword ? 'Updating...' : 'Update Password'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
