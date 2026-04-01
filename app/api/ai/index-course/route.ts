import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { ragService } from '@/lib/ai/rag-service'

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Check if user is admin (you'll implement this)
    const body = await req.json()
    const { courseId, title, description, sections } = body

    if (!courseId || !title || !sections) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const indexedCount = await ragService.indexCourse(
      courseId,
      title,
      description,
      sections
    )

    return NextResponse.json({ 
      success: true, 
      indexedCount,
      message: `Indexed ${indexedCount} vectors for course ${title}`
    })
    
  } catch (error) {
    console.error('Index Course Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
