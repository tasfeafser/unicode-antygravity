import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { ragService } from '@/lib/ai/rag-service'
import { Noto_Traditional_Nushu } from 'next/font/google'

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { message, courseId, stream } = body

    if (!message) {
      return new NextResponse('Missing message', { status: 400 })
    }

    if (stream) {
      // Streaming response with RAG
      const encoder = new TextEncoder()
      const customReadable = new ReadableStream({
        async start(controller) {
          try {
            await ragService.chatWithRAG(
              message,
              courseId,
              userId,
              (chunk) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`))
              }
            )
            controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
            controller.close()
          } catch (error) {
            controller.error(error)
          }
        },
      })

      return new Response(customReadable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    }

    // Non-streaming response
    const response = await ragService.chatWithRAG(message, courseId, userId)
    return NextResponse.json(response)

  } catch (error) {
    console.error('RAG Chat Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

