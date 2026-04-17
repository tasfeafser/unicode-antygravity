import { Pinecone, Index, RecordMetadata } from '@pinecone-database/pinecone'
import { embeddingService } from './embeddings'

// Types for our vectors
export interface CourseVector extends Record<string, any> {
  type: 'course' | 'document' | 'code' | 'qa'
  title: string
  content: string
  courseId?: string
  userId?: string
  tags?: string[]
}

export class PineconeService {
  private indexName: string
  private _index?: Index
  private _pinecone?: Pinecone

  constructor() {
    this.indexName = process.env.PINECONE_INDEX_NAME || 'unicode'
  }

  private get pinecone() {
    if (!this._pinecone) {
      this._pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY || 'placeholder_key',
      })
    }
    return this._pinecone
  }

  private get index() {
    if (!this._index) {
      this._index = this.pinecone.Index(this.indexName)
    }
    return this._index
  }

  /**
   * Upsert vectors into Pinecone
   */
  async upsertVectors(
    vectors: Array<{
      id: string
      values: number[]
      metadata: CourseVector
    }>
  ) {
    try {
      await this.index.upsert(vectors)
      console.log(`Upserted ${vectors.length} vectors`)
    } catch (error) {
      console.error('Error upserting vectors:', error)
      throw error
    }
  }

  /**
   * Search for similar content
   */
  async search(
    query: string,
    topK: number = 5,
    filter?: { type?: string; courseId?: string }
  ): Promise<Array<{
    id: string
    score: number
    metadata: CourseVector
  }>> {
    try {
      // Generate embedding for the query
      const queryEmbedding = await embeddingService.generateEmbedding(query)

      // Search Pinecone
      const results = await this.index.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true,
        filter: filter ? {
          type: { $eq: filter.type },
          courseId: filter.courseId ? { $eq: filter.courseId } : undefined,
        } : undefined,
      })

      return results.matches?.map(match => ({
        id: match.id,
        score: match.score || 0,
        metadata: match.metadata as CourseVector,
      })) || []
    } catch (error) {
      console.error('Search error:', error)
      throw error
    }
  }

  /**
   * Delete vectors by ID
   */
  async deleteVectors(ids: string[]) {
    try {
      await this.index.deleteMany(ids)
      console.log(`Deleted ${ids.length} vectors`)
    } catch (error) {
      console.error('Delete error:', error)
      throw error
    }
  }

  /**
   * Add course content to vector database
   */
  async indexCourseContent(
    courseId: string,
    title: string,
    content: string,
    sections: Array<{ title: string; content: string }>
  ) {
    const vectors = []

    // Create main course vector
    const mainEmbedding = await embeddingService.generateEmbedding(
      `${title}\n\n${content}`
    )
    vectors.push({
      id: `course-${courseId}`,
      values: mainEmbedding,
      metadata: {
        type: 'course' as const,
        title,
        content: content.substring(0, 1000), // Store preview
        courseId,
      },
    })

    // Create vectors for each section
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
      const sectionEmbedding = await embeddingService.generateEmbedding(
        `${section.title}\n\n${section.content}`
      )
      vectors.push({
        id: `course-${courseId}-section-${i}`,
        values: sectionEmbedding,
        metadata: {
          type: 'document' as const,
          title: section.title,
          content: section.content.substring(0, 1000),
          courseId,
          tags: ['section'],
        },
      })
    }

    await this.upsertVectors(vectors)
    return vectors.length
  }

  /**
   * Index code examples
   */
  async indexCodeExample(
    codeId: string,
    language: string,
    code: string,
    description: string,
    tags: string[]
  ) {
    const embedding = await embeddingService.generateEmbedding(
      `${description}\n\n${language} code:\n${code}`
    )

    await this.upsertVectors([{
      id: `code-${codeId}`,
      values: embedding,
      metadata: {
        type: 'code' as const,
        title: description,
        content: code.substring(0, 500),
        tags,
      },
    }])
  }

  /**
   * Index Q&A pairs for FAQ
   */
  async indexQA(
    questionId: string,
    question: string,
    answer: string,
    topic: string
  ) {
    const embedding = await embeddingService.generateEmbedding(question)

    await this.upsertVectors([{
      id: `qa-${questionId}`,
      values: embedding,
      metadata: {
        type: 'qa' as const,
        title: question,
        content: answer,
        tags: [topic],
      },
    }])
  }

  /**
   * Get relevant context for AI
   */
  async getRelevantContext(
    query: string,
    courseId?: string,
    maxResults: number = 3
  ): Promise<string> {
    const results = await this.search(query, maxResults, { courseId })

    if (results.length === 0) {
      return ''
    }

    const contextParts = results.map(result => {
      const metadata = result.metadata
      if (metadata.type === 'qa') {
        return `Q: ${metadata.title}\nA: ${metadata.content}`
      } else if (metadata.type === 'code') {
        return `Example: ${metadata.title}\n\`\`\`\n${metadata.content}\n\`\`\``
      } else {
        return `From "${metadata.title}":\n${metadata.content}`
      }
    })

    return contextParts.join('\n\n---\n\n')
  }
}

export const pineconeService = new PineconeService()
