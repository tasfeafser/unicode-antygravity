import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { messages, systemPrompt } = await req.json()

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 })
    }

    const groqMessages = []
    if (systemPrompt) {
      groqMessages.push({ role: 'system', content: systemPrompt })
    }
    
    // Map standard messages
    messages.forEach((m: { role: string; content: string }) => {
      groqMessages.push({ role: m.role, content: m.content })
    })

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 2048,
      })
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('Groq API error:', errText)
      return NextResponse.json({ error: 'AI service error' }, { status: 502 })
    }

    const data = await res.json()
    const text = data.choices?.[0]?.message?.content || 'No response generated.'

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
