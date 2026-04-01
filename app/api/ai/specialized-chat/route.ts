import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { groqService } from '@/lib/ai/groq-service'
import { AIPersona } from '@/lib/ai/prompts'

/**
 * Universal specialized chat endpoint capable of adopting multiple instructor personas.
 * Perfect for connecting distinct UI components (like a Linux Terminal Simulator or a Security Sandbox).
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { messages, context, persona, stream } = body

    if (!messages || !Array.isArray(messages)) {
      return new NextResponse('Invalid messages', { status: 400 })
    }

    // Merge persona into context (prompts.ts will parse it)
    const activeContext = { ...context, persona: persona as AIPersona }

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
              activeContext
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

    const response = await groqService.chat(messages, activeContext)
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Specialized AI Chat Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
