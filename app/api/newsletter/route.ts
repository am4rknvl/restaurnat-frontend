import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const email = (data?.email || '').toLowerCase().trim()
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const dbPath = path.join(process.cwd(), 'data', 'newsletter.json')
    let list: string[] = []
    try {
      if (fs.existsSync(dbPath)) {
        list = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
      } else {
        fs.mkdirSync(path.dirname(dbPath), { recursive: true })
      }
    } catch (err) {
      // ignore
    }

    if (!list.includes(email)) {
      list.push(email)
      fs.writeFileSync(dbPath, JSON.stringify(list, null, 2))
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
