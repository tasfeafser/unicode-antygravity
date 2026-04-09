import { GoogleGenerativeAI } from '@google/generative-ai'

// Alternatively we could use OpenAI's text-embedding-3-small or text-embedding-ada-002
// But since the project is already using Gemini elsewhere, we'll use Google's embedding model.

export class EmbeddingService {
  private genAI: any

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
  }

  /**
   * Generates a semantic vector embedding for a given text string.
   * Uses Google's standard embedding model.
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      // We clean the text before embedding for better quality
      const cleanText = text.replace(/\\n/g, ' ').trim()
      
      const model = this.genAI.getGenerativeModel({ model: "text-embedding-004" })
      const result = await model.embedContent(cleanText)
      const embedding = result.embedding
      
      return embedding.values
    } catch (error) {
      console.error('Error generating embedding:', error)
      // Return a fallback zero vector if everything fails (match Pinecone dimensions, often 768 for gemini)
      // Note: This is just a fallback to prevent crashes in dev.
      return new Array(768).fill(0)
    }
  }

  /**
   * Generates embeddings for an array of strings in batches.
   */
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    // In a real production app we would batch these calls. For now we use Promise.all.
    return Promise.all(texts.map(text => this.generateEmbedding(text)))
  }
}

export const embeddingService = new EmbeddingService()
