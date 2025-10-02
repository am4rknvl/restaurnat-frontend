import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Telebirr webhook handler with HMAC validation and optional forwarding
export async function POST(req: Request) {
  try {
    // Read raw body once for signature verification, then parse JSON
    const rawBody = await req.text()
    const payload = JSON.parse(rawBody || '{}')

    const signatureHeader = (req.headers.get('x-telebirr-signature') || req.headers.get('x-signature') || '').trim()
    const secret = process.env.TELEBIRR_WEBHOOK_SECRET || ''

    if (secret) {
      if (!signatureHeader) {
        return NextResponse.json({ error: 'missing signature' }, { status: 401 })
      }
      const computed = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
      const valid = crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signatureHeader))
      if (!valid) {
        return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
      }
    } else {
      console.warn('[webhook][telebirr] TELEBIRR_WEBHOOK_SECRET not set; skipping signature verification')
    }

    // Optional: forward to backend if configured
    const forwardUrl = process.env.BACKEND_WEBHOOK_FORWARD_URL
    if (forwardUrl) {
      const adminToken = process.env.BACKEND_ADMIN_TOKEN
      try {
        const res = await fetch(forwardUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
            'x-provider': 'telebirr',
          },
          body: JSON.stringify({ provider: 'telebirr', payload }),
        })
        if (!res.ok) {
          const txt = await res.text().catch(() => '')
          console.error('[webhook][telebirr] forward failed', res.status, txt)
        }
      } catch (err) {
        console.error('[webhook][telebirr] forward error', err)
      }
    }

    // TODO: If you run your own real-time server, broadcast payment update from here

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'failed' }, { status: 500 })
  }
}
