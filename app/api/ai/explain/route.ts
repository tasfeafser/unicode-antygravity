import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { geminiService } from '@/lib/ai/gemini-service'

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { code, language } = await req.json()

    if (!code || !language) {
      return new NextResponse('Missing code or language', { status: 400 })
    }

    // Using Gemini for complex code explanation
    const explanation = await geminiService.explainCode(code, language)
    return NextResponse.json(explanation)
    
  } catch (error) {
    console.error('Code Explanation Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
