import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { groqService } from '@/lib/ai/groq-service'

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { messages, context, stream } = body

    if (!messages || !Array.isArray(messages)) {
      return new NextResponse('Invalid messages', { status: 400 })
    }

    // Handle streaming response
    if (stream) {
      const encoder = new TextEncoder()
      const customReadable = new ReadableStream({
        async start(controller) {
          try {
            await groqService.chatStream(
              messages,
              (chunk) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`))
              },
              context
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
    const response = await groqService.chat(messages, context)
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('AI Chat Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
