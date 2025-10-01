import { NextResponse } from 'next/server'

// Mock Telebirr VRO checkout session creation
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { customer_name, phone, items, total } = body || {}
    if (!customer_name || !phone || !items) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Simulate creating a Telebirr payment session. In production replace with Telebirr SDK/API call.
    const sessionId = `tb_${Date.now()}`
    const paymentUrl = `https://telebirr.mock/pay?session=${sessionId}`

    return NextResponse.json({ ok: true, sessionId, paymentUrl })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
