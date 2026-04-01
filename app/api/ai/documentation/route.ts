import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { geminiService } from '@/lib/ai/gemini-service'

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const request = await req.json()

    if (!request.type || !request.title) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const documentation = await geminiService.generateDocumentation(request.type, request.title, request.description || '')
    return NextResponse.json({ content: documentation })
  } catch (error) {
    console.error('Documentation Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
