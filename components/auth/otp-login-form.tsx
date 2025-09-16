"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Smartphone, Shield } from "lucide-react"

export function OTPLoginForm() {
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const { requestOTP, verifyOTP, isLoading, error } = useAuth()
  const router = useRouter()

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await requestOTP(phoneNumber)
      setStep("otp")
    } catch (err) {
      // Error is handled by the auth context
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await verifyOTP(phoneNumber, otpCode)
      router.push("/app")
    } catch (err) {
      // Error is handled by the auth context
    }
  }

  const handleBackToPhone = () => {
    setStep("phone")
    setOtpCode("")
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">{step === "phone" ? "Sign In" : "Verify Code"}</CardTitle>
        <CardDescription className="text-center">
          {step === "phone"
            ? "Enter your phone number to receive a verification code"
            : `We sent a 6-digit code to ${phoneNumber}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4 border-destructive/50 text-destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === "phone" ? (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="phone"
                  placeholder="+251912345678"
                  type="tel"
                  autoComplete="tel"
                  disabled={isLoading}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button disabled={isLoading || !phoneNumber} className="w-full">
              {isLoading ? "Sending Code..." : "Send Verification Code"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="otp"
                  placeholder="123456"
                  type="text"
                  maxLength={6}
                  disabled={isLoading}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  className="pl-10 text-center text-lg tracking-widest"
                  required
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBackToPhone}
                disabled={isLoading}
                className="flex-1 bg-transparent"
              >
                Back
              </Button>
              <Button disabled={isLoading || otpCode.length !== 6} className="flex-1">
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </div>
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => handleRequestOTP({ preventDefault: () => {} } as React.FormEvent)}
                disabled={isLoading}
                className="text-sm text-muted-foreground"
              >
                Didn't receive code? Resend
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
