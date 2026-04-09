import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { groqService } from '@/lib/ai/groq-service'

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { messages, context, stream, imagePayload, modelId, apiKey } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new NextResponse('Invalid messages', { status: 400 })
    }

    // Handle Custom API / OpenRouter Integration
    if (modelId === 'custom-api' || modelId === 'gemini-vision') {
      const isCustomParams = modelId === 'custom-api' && apiKey
      const targetApiKey = isCustomParams ? apiKey : process.env.GEMINI_API_KEY || ''
      const endpoint = isCustomParams 
        ? 'https://openrouter.ai/api/v1/chat/completions'
        : `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`

      const visionModel = isCustomParams ? 'google/gemini-1.5-pro' : 'gemini-1.5-pro'
      
      const formattedMessages = messages.map(msg => {
        if (msg.role === 'user' && imagePayload && msg === messages[messages.length - 1]) {
          return {
            role: 'user',
            content: [
              { type: 'text', text: msg.content.replace('[Image Attached] ', '') },
              { type: 'image_url', image_url: { url: imagePayload } }
            ]
          }
        }
        return msg
      })

      if (stream) {
        const fetchRes = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${targetApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: visionModel,
            messages: formattedMessages,
            stream: true
          })
        })

        if (!fetchRes.ok) {
          const err = await fetchRes.text()
          throw new Error(`External API Error: ${err}`)
        }

        const encoder = new TextEncoder()
        const customReadable = new ReadableStream({
          async start(controller) {
            const reader = fetchRes.body?.getReader()
            if (!reader) return
            const decoder = new TextDecoder()
            while (true) {
              const { done, value } = await reader.read()
              if (done) break
              const chunk = decoder.decode(value)
              const lines = chunk.split('\n')
              for (const line of lines) {
                if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                  try {
                    const data = JSON.parse(line.slice(5))
                    const content = data.choices?.[0]?.delta?.content || ''
                    if (content) {
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: content })}\n\n`))
                    }
                  } catch (e) {}
                }
              }
            }
            controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
            controller.close()
          }
        })
        return new Response(customReadable, {
          headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' }
        })
      }
    }

    // Default Groq Handling Route
    if (stream) {
      const encoder = new TextEncoder()
      const customReadable = new ReadableStream({
        async start(controller) {
          try {
            await groqService.chatStream(
              messages,
              (chunk) => { controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`)) },
              context
            )
            controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
            controller.close()
          } catch (error) { controller.error(error) }
        },
      })
      return new Response(customReadable, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' } })
    }

    const response = await groqService.chat(messages, context)
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('AI Chat Error:', error)
    return new NextResponse(JSON.stringify({ error: String(error) }), { status: 500 })
  }
}
