import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Available models (all free)
export const GEMINI_MODELS = {
  FLASH: 'gemini-1.5-flash',      // Fast, good for chat
  PRO: 'gemini-1.5-pro',           // More capable, slower
  FLASH_8B: 'gemini-1.5-flash-8b', // Even faster, slightly less capable
} as const

export type GeminiModel = typeof GEMINI_MODELS[keyof typeof GEMINI_MODELS]

export class GeminiService {
  private model: string

  constructor(model: string = GEMINI_MODELS.FLASH) {
    this.model = model
  }

  /**
   * Main chat function
   */
  async chat(
    messages: Array<{ role: string; content: string }>,
    context?: { skillLevel?: string; topic?: string }
  ) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: this.model,
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      })

      // Build system prompt
      let systemPrompt = `You are Unicode AI, an expert computer science tutor.
Your goal is to help students learn programming and computer science concepts.

Guidelines:
- Be patient and encouraging
- Explain concepts with examples
- Break down complex topics
- Provide code examples when relevant
- Adapt to student's skill level`

      if (context?.skillLevel) {
        systemPrompt += `\n- Student skill level: ${context.skillLevel}`
      }
      if (context?.topic) {
        systemPrompt += `\n- Current topic: ${context.topic}`
      }

      // Get last user message
      const lastMessage = messages[messages.length - 1]
      
      // Start chat with history
      const chat = model.startChat({
        history: messages.slice(0, -1).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        })),
        generationConfig: {
          maxOutputTokens: 4096,
          temperature: 0.7,
        },
      })

      const result = await chat.sendMessage([
        { text: systemPrompt },
        { text: lastMessage.content || '' }
      ])
      
      const response = await result.response
      return {
        content: response.text(),
        model: this.model,
      }
    } catch (error) {
      console.error('Gemini API Error:', error)
      throw new Error('Failed to get AI response')
    }
  }

  /**
   * Explain code
   */
  async explainCode(code: string, language: string) {
    const model = genAI.getGenerativeModel({ model: this.model })
    
    const prompt = `Explain this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Provide:
1. What the code does (clear explanation)
2. Time complexity analysis
3. 2-3 suggestions for improvement
4. Key concepts to learn

Format as JSON with keys: explanation, complexity, improvements`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(text)
      return {
        code,
        language,
        explanation: parsed.explanation,
        complexity: parsed.complexity,
        improvements: parsed.improvements || []
      }
    } catch {
      // Return as is if not JSON
      return {
        code,
        language,
        explanation: text,
        complexity: 'Analysis provided above',
        improvements: []
      }
    }
  }

  /**
   * Debug code
   */
  async debugCode(code: string, language: string, error?: string) {
    const model = genAI.getGenerativeModel({ model: this.model })
    
    const errorContext = error ? `Error message: ${error}` : 'No specific error'
    
    const prompt = `Debug this ${language} code:

\`\`\`${language}
${code}
\`\`\`

${errorContext}

Provide:
1. Issues found (list)
2. Explanation of each issue
3. Corrected code
4. Best practices

Format as JSON with keys: issues, explanation, correctedCode`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    try {
      const parsed = JSON.parse(text)
      return {
        fixes: parsed.issues,
        explanation: parsed.explanation,
        correctedCode: parsed.correctedCode
      }
    } catch {
      return {
        fixes: ['See explanation below'],
        explanation: text,
        correctedCode: undefined
      }
    }
  }

  /**
   * Generate documentation
   */
  async generateDocumentation(type: string, title: string, description: string) {
    const model = genAI.getGenerativeModel({ model: this.model })
    
    const templates: Record<string, string> = {
      srs: `Create Software Requirements Specification for: ${title}\n\n${description}\n\nInclude: Introduction, Overall Description, System Features, External Interfaces, Non-Functional Requirements`,
      api: `Generate API documentation for: ${title}\n\n${description}\n\nInclude: Overview, Authentication, Endpoints, Request/Response schemas, Error codes`,
      ppt: `Create presentation content for: ${title}\n\n${description}\n\nCreate 10 slides with: Title, Introduction, Key concepts, Examples, Best practices, Conclusion`,
      report: `Create technical report for: ${title}\n\n${description}\n\nInclude: Executive Summary, Introduction, Methodology, Findings, Recommendations, Conclusion`
    }
    
    const prompt = templates[type] || templates.report
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  }

  /**
   * Generate coding exercise
   */
  async generateExercise(topic: string, difficulty: string, language: string = 'python') {
    const model = genAI.getGenerativeModel({ model: this.model })
    
    const prompt = `Create a ${difficulty} level coding exercise about ${topic} in ${language}.

Return as JSON with keys: title, description, starterCode, solution, testCases`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    try {
      return JSON.parse(text)
    } catch {
      throw new Error('Failed to generate exercise')
    }
  }
}

// Export singleton
export const geminiService = new GeminiService()
