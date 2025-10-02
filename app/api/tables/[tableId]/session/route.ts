import { NextResponse } from 'next/server'

// Simple mock for table session creation. In production this should create a DB-backed session
export async function POST(req: Request, { params }: { params: { tableId: string } }) {
  try {
    const { tableId } = params
    const body = await req.json().catch(() => ({}))
    const sessionId = `tbl_${tableId}_${Date.now()}`
    const session = {
      sessionId,
      tableId,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 1 hour
    }

    return NextResponse.json(session)
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'failed' }, { status: 500 })
  }
}
