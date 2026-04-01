import { groqService } from './groq-service'
import { pineconeService } from './pinecone-service'
import { geminiService } from './gemini-service'

export class RAGService {
  /**
   * Enhanced chat with RAG context
   */
  async chatWithRAG(
    message: string,
    courseId?: string,
    userId?: string,
    onStream?: (chunk: string) => void
  ) {
    // Step 1: Get relevant context from Pinecone
    const context = await pineconeService.getRelevantContext(
      message,
      courseId,
      3
    )

    // Step 2: Build enhanced prompt with context
    const enhancedMessage = context
      ? `Here is some relevant context that might help:\n\n${context}\n\nQuestion: ${message}`
      : message

    if (onStream) {
      // Streaming response
      await groqService.chatStream(
        [{ role: 'user', content: enhancedMessage }],
        onStream,
        { topic: courseId ? 'Course-specific' : 'General' }
      )
      return { content: '', model: groqService['model'] } // Return empty format for streaming
    }

    // Step 3: Get response from AI
    const response = await groqService.chat(
      [{ role: 'user', content: enhancedMessage }],
      { topic: courseId ? 'Course-specific' : 'General' }
    )

    return response
  }

  /**
   * Explain code with relevant examples
   */
  async explainCodeWithRAG(
    code: string,
    language: string,
    courseId?: string
  ) {
    // Get similar code examples
    const similarCode = await pineconeService.search(
      `${language} code example: ${code.substring(0, 200)}`,
      2,
      { type: 'code' }
    )

    let context = ''
    if (similarCode.length > 0) {
      context = 'Similar examples:\n' + similarCode.map(ex => 
        `- ${ex.metadata.title}: ${ex.metadata.content}`
      ).join('\n')
    }

    const enhancedPrompt = `${context}\n\nExplain this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``

    const explanation = await geminiService.explainCode(code, language)
    return explanation
  }

  /**
   * Index a new course
   */
  async indexCourse(
    courseId: string,
    title: string,
    description: string,
    sections: Array<{ title: string; content: string }>
  ) {
    return await pineconeService.indexCourseContent(
      courseId,
      title,
      description,
      sections
    )
  }
}

export const ragService = new RAGService()
