import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { geminiService } from '@/lib/ai/gemini-service'

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { code, language, error } = await req.json()

    if (!code || !language) {
      return new NextResponse('Missing code or language', { status: 400 })
    }

    const debugResult = await geminiService.debugCode(code, language, error)
    return NextResponse.json(debugResult)
  } catch (error) {
    console.error('Debug Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
