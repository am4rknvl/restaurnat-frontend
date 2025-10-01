import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripeSecret = process.env.STRIPE_SECRET || ''
const stripe = new Stripe(stripeSecret, { apiVersion: '2022-11-15' })

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, successUrl, cancelUrl } = body
    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items' }, { status: 400 })
    }

    const line_items = items.map((it: any) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: it.name || it.product_id || 'Item' },
        unit_amount: Math.round((it.price || 0) * 100),
      },
      quantity: it.quantity || 1,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/orders`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Stripe error', err)
    return NextResponse.json({ error: err.message || 'Checkout error' }, { status: 500 })
  }
}
