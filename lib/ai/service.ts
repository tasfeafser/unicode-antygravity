import { anthropic, CLAUDE_MODELS, ClaudeModel } from './client'
import { AIMessage, AIContext, AIResponse, CodeExplanation, DocumentationRequest } from './types'

export class AIService {
  private model: ClaudeModel

  constructor(model: ClaudeModel = CLAUDE_MODELS.SONNET) {
    this.model = model
  }

  /**
   * Main chat function with context
   */
  async chat(
    messages: AIMessage[],
    context?: AIContext,
    onStream?: (chunk: string) => void
  ): Promise<AIResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt(context)

      const response = await anthropic.messages.create({
        model: this.model,
        max_tokens: 4096,
        system: systemPrompt,
        messages: messages.map(msg => ({
          role: msg.role === 'system' ? 'user' : msg.role, // Anthropic only allows user/assistant in messages array.
          content: msg.content
        })) as any,
        stream: !!onStream
      })

      if (onStream && 'stream' in response) {
        let fullContent = ''
        for await (const chunk of response as any) {
          if (chunk.type === 'content_block_delta') {
            const text = chunk.delta?.text || ''
            fullContent += text
            onStream(text)
          }
        }
        return {
          content: fullContent,
          model: this.model,
        }
      }

      const completion = response as any
      return {
        content: completion.content[0].text,
        model: this.model,
        usage: {
          inputTokens: completion.usage.input_tokens,
          outputTokens: completion.usage.output_tokens
        }
      }
    } catch (error) {
      console.error('AI Chat Error:', error)
      throw new Error('Failed to get AI response')
    }
  }

  /**
   * Explain code with context
   */
  async explainCode(
    code: string,
    language: string,
    context?: AIContext
  ): Promise<CodeExplanation> {
    const systemPrompt = `You are an expert programming tutor. Explain code clearly and help students understand.`

    const userPrompt = `Explain this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Provide:
1. A clear explanation of what the code does
2. Time complexity analysis
3. 2-3 suggestions for improvement (if applicable)
4. Key concepts the student should learn from this code

Format your response as JSON with keys: explanation, complexity, improvements`

    const response = await this.chat([
      { role: 'user', content: systemPrompt }, // Using user role for system context to avoid msg shape validation error
      { role: 'user', content: userPrompt }
    ], context)

    try {
      // Parse the JSON response
      const parsed = JSON.parse(response.content)
      return {
        code,
        language,
        explanation: parsed.explanation,
        complexity: parsed.complexity,
        improvements: parsed.improvements
      }
    } catch {
      // If parsing fails, return a structured response
      return {
        code,
        language,
        explanation: response.content,
        complexity: 'Unable to determine',
        improvements: []
      }
    }
  }

  /**
   * Debug code and suggest fixes
   */
  async debugCode(
    code: string,
    language: string,
    error?: string
  ): Promise<{ fixes: string[]; explanation: string; correctedCode?: string }> {
    const errorContext = error ? `Error message: ${error}` : 'No specific error provided'

    const systemPrompt = `You are an expert debugger. Help identify and fix issues in code.`

    const userPrompt = `Debug this ${language} code:

\`\`\`${language}
${code}
\`\`\`

${errorContext}

Provide:
1. List of issues found
2. Explanation of each issue
3. Corrected code with fixes
4. Best practices applied

Format as JSON with keys: issues (array), explanation, correctedCode`

    const response = await this.chat([
      { role: 'user', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ])

    try {
      const parsed = JSON.parse(response.content)
      return {
        fixes: parsed.issues,
        explanation: parsed.explanation,
        correctedCode: parsed.correctedCode
      }
    } catch {
      return {
        fixes: ['Unable to parse debug response'],
        explanation: response.content,
        correctedCode: undefined
      }
    }
  }

  /**
   * Generate documentation
   */
  async generateDocumentation(request: DocumentationRequest): Promise<string> {
    const templates = {
      srs: `Create a Software Requirements Specification (SRS) for: ${request.title}
      
Description: ${request.description}
${request.requirements ? `Requirements: ${request.requirements.join(', ')}` : ''}

Include:
1. Introduction
2. Overall Description
3. System Features
4. External Interface Requirements
5. Non-Functional Requirements
6. Use Cases
7. Appendix`,

      api: `Generate API documentation for: ${request.title}
      
Description: ${request.description}
${request.code ? `Code: ${request.code}` : ''}

Include:
1. Overview
2. Authentication
3. Endpoints with examples
4. Request/Response schemas
5. Error codes
6. Rate limiting`,

      uml: `Create UML documentation for: ${request.title}
      
Description: ${request.description}
${request.code ? `Code: ${request.code}` : ''}

Provide:
1. Class diagram description
2. Sequence diagrams for main flows
3. Component relationships
4. Mermaid.js code for diagrams`,

      ppt: `Create presentation content for: ${request.title}
      
Description: ${request.description}

Create 10-15 slides covering:
1. Title slide
2. Introduction
3. Key concepts
4. Implementation details
5. Examples
6. Best practices
7. Conclusion
8. Q&A

Format each slide with bullet points and key takeaways.`,

      report: `Create a detailed report for: ${request.title}
      
Description: ${request.description}

Include:
1. Executive Summary
2. Introduction
3. Methodology
4. Findings/Analysis
5. Recommendations
6. Conclusion
7. References`
    }

    const template = templates[request.type]
    
    const response = await this.chat([
      { 
        role: 'user', 
        content: `You are a technical documentation expert. Generate clear, professional documentation for the following request:\n\n${template}` 
      }
    ])

    return response.content
  }

  /**
   * Generate coding exercises
   */
  async generateExercise(
    topic: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    language: string = 'python'
  ): Promise<{
    title: string
    description: string
    starterCode: string
    solution: string
    testCases?: string[]
  }> {
    const systemPrompt = `You are a coding instructor. Create engaging programming exercises.`

    const userPrompt = `Create a ${difficulty} level coding exercise about ${topic} in ${language}.

Provide:
1. Exercise title
2. Problem description
3. Starter code template
4. Solution code
5. Test cases (if applicable)

Format as JSON with keys: title, description, starterCode, solution, testCases`

    const response = await this.chat([
      { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }
    ])

    try {
      return JSON.parse(response.content)
    } catch {
      throw new Error('Failed to generate exercise')
    }
  }

  /**
   * Generate personalized learning path
   */
  async generateLearningPath(
    topics: string[],
    skillLevel: string,
    goals: string[]
  ): Promise<{
    modules: Array<{
      topic: string
      order: number
      estimatedHours: number
      prerequisites: string[]
      resources: string[]
    }>
    totalDuration: number
    recommendedProjects: string[]
  }> {
    const userPrompt = `Create a personalized learning path for:
Skills: ${skillLevel}
Topics to cover: ${topics.join(', ')}
Goals: ${goals.join(', ')}

Create a structured curriculum with modules, estimated hours, and recommended projects.
Format as JSON.`

    const response = await this.chat([
      { role: 'user', content: `You are an expert curriculum designer. ${userPrompt}` }
    ])

    try {
      return JSON.parse(response.content)
    } catch {
      throw new Error('Failed to generate learning path')
    }
  }

  private buildSystemPrompt(context?: AIContext): string {
    let prompt = `You are Unicode AI, an expert computer science tutor and assistant. 
Your goal is to help students learn programming, computer science concepts, and software development.

Guidelines:
- Be patient and encouraging
- Explain concepts clearly with examples
- Break down complex topics
- Ask guiding questions when appropriate
- Provide code examples when relevant
- Reference CS fundamentals
- Adapt to student's skill level`

    if (context?.skillLevel) {
      prompt += `\n- Student skill level: ${context.skillLevel}`
    }

    if (context?.topic) {
      prompt += `\n- Current topic: ${context.topic}`
    }

    prompt += `\n\nAlways aim to build understanding, not just provide answers.`

    return prompt
  }
}

// Export a singleton instance
export const aiService = new AIService()
