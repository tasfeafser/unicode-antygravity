import Groq from 'groq-sdk'
import { getSystemPrompt, AIPersona } from './prompts'

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export const GROQ_MODELS = {
  LLAMA_3_70B: 'llama-3.3-70b-versatile',
  LLAMA_3_8B: 'llama-3.1-8b-instant',
  MIXTRAL: 'mixtral-8x7b-32768',
} as const

export class GroqService {
  private model: string

  constructor(model: string = GROQ_MODELS.LLAMA_3_8B) {
    this.model = model
  }

  /**
   * Fast chat responses using Groq
   */
  async chat(
    messages: Array<{ role: string; content: string }>,
    context?: { skillLevel?: string; topic?: string; persona?: AIPersona }
  ) {
    try {
      const systemPrompt = this.buildSystemPrompt(context)

      const completion = await groq.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ] as any[],
        temperature: 0.7,
        max_tokens: 4096,
      })

      return {
        content: completion.choices[0]?.message?.content || '',
        model: this.model,
        usage: {
          inputTokens: completion.usage?.prompt_tokens,
          outputTokens: completion.usage?.completion_tokens,
        }
      }
    } catch (error) {
      console.error('Groq API Error:', error)
      throw new Error('Failed to get AI response from Groq')
    }
  }

  /**
   * Streaming chat for real-time responses
   */
  async chatStream(
    messages: Array<{ role: string; content: string }>,
    onChunk: (chunk: string) => void,
    context?: { skillLevel?: string; topic?: string; persona?: AIPersona }
  ) {
    try {
      const systemPrompt = this.buildSystemPrompt(context)

      const stream = await groq.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ] as any[],
        temperature: 0.7,
        max_tokens: 4096,
        stream: true,
      })

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || ''
        if (content) {
          onChunk(content)
        }
      }
    } catch (error) {
      console.error('Groq Stream Error:', error)
      throw new Error('Failed to stream AI response')
    }
  }

  private buildSystemPrompt(context?: { skillLevel?: string; topic?: string; persona?: AIPersona }): string {
    return getSystemPrompt(context?.persona, context)
  }
}

export const groqService = new GroqService()
