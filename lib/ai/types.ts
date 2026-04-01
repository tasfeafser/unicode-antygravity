export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AIContext {
  userId?: string
  courseId?: string
  topic?: string
  skillLevel?: 'beginner' | 'intermediate' | 'advanced'
}

export interface AIResponse {
  content: string
  model: string
  usage?: {
    inputTokens: number
    outputTokens: number
  }
}

export interface CodeExplanation {
  code: string
  language: string
  explanation: string
  complexity: string
  improvements?: string[]
}

export interface DocumentationRequest {
  type: 'srs' | 'api' | 'uml' | 'ppt' | 'report'
  title: string
  description: string
  requirements?: string[]
  code?: string
}
