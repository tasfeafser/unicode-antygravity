import Anthropic from '@anthropic-ai/sdk'

// Initialize the Anthropic client
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Available Claude models
export const CLAUDE_MODELS = {
  LATEST: 'claude-3-5-sonnet-20241022',
  OPUS: 'claude-3-opus-20240229',
  SONNET: 'claude-3-sonnet-20240229',
  HAIKU: 'claude-3-haiku-20240307',
} as const

export type ClaudeModel = typeof CLAUDE_MODELS[keyof typeof CLAUDE_MODELS]
