"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TablesAdminPage() {
  const [count, setCount] = useState(10)
  const [qrs, setQrs] = useState<Array<{ tableId: string; dataUrl: string }>>([])
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setLoading(true)
    setQrs([])
    try {
      // dynamic import so local dev doesn't fail if qrcode isn't installed
      const QR = await import('qrcode').catch(() => null)
      for (let i = 1; i <= count; i++) {
        const id = String(i)
        const url = `${window.location.origin}/t/${id}`
        let dataUrl = ''
        if (QR && QR.toDataURL) {
          dataUrl = await QR.toDataURL(url)
        }
        setQrs((s) => [...s, { tableId: id, dataUrl }])
      }
    } catch (e) {
      console.error('Failed to generate QR codes', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">Table QR Generator</h1>
      <Card>
        <CardHeader>
          <CardTitle>Generate QR codes for tables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Input type="number" value={count} onChange={(e:any) => setCount(Number(e.target.value))} className="w-32" />
            <Button onClick={generate} disabled={loading}>{loading ? 'Generating...' : 'Generate'}</Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {qrs.map((q) => (
              <div key={q.tableId} className="p-2 border rounded">
                <div className="text-sm mb-2">Table {q.tableId}</div>
                {q.dataUrl ? <img src={q.dataUrl} alt={`QR ${q.tableId}`} className="w-full" /> : <div className="text-xs text-muted-foreground">Install `qrcode` to generate images</div>}
                <div className="mt-2 text-xs"><a className="underline text-primary" href={`/t/${q.tableId}`}>{`/t/${q.tableId}`}</a></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
