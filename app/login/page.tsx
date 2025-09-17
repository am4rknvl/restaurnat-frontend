import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">R</span>
            </div>
            <span className="font-bold text-xl">RestaurantOS</span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to access your restaurant dashboard</p>
        </div>
  <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Need help?{" "}
          <Link href="/support" className="underline underline-offset-4 hover:text-primary">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  )
}
