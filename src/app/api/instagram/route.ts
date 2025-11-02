import { NextResponse } from 'next/server'

const API_URL = 'https://feedframer.com/api/v1/me'

export async function GET(request: Request) {
  try {
    const apiKey = process.env.FEED_FRAMER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Feedframer API key not configured' }, { status: 500 })
    }

    const url = `${API_URL}?api_key=${encodeURIComponent(apiKey)}`
    const res = await fetch(url)

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: 'Failed to fetch from Feedframer', detail: text }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: 'Unexpected server error', detail: err.message || String(err) }, { status: 500 })
  }
}
