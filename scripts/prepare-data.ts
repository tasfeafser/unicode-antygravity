import { embeddingService } from '../lib/ai/embeddings'

interface DataSource {
  name: string
  type: 'course' | 'code' | 'qa' | 'resource'
  loader: () => Promise<any[]>
}

export class DataPreparer {
  async prepareAndChunkContent() {
    // 1. Load raw content
    const courses = await this.loadCourses()
    
    // 2. Chunk content (important for good retrieval)
    const chunks = []
    
    for (const course of courses) {
      // Split into manageable chunks (500-1000 tokens)
      const courseChunks = this.chunkContent(course.content, {
        chunkSize: 500,
        overlap: 50,  // Overlap for context preservation
      })
      
      chunks.push(...courseChunks.map((chunk: any) => ({
        ...chunk,
        metadata: {
          type: 'course',
          title: course.title,
          section: course.section,
          difficulty: course.difficulty
        }
      })))
    }
    
    // 3. Generate embeddings for all chunks
    const texts = chunks.map(chunk => chunk.text)
    const embeddings = await embeddingService.generateEmbeddings(texts)
    
    // 4. Prepare vectors for Pinecone
    const vectors = chunks.map((chunk, i) => ({
      id: `${chunk.metadata.type}-${chunk.id}`,
      values: embeddings[i],
      metadata: chunk.metadata
    }))
    
    return vectors
  }
  
  private async loadCourses() {
    // MOCK DATA: In reality this would read from markdown files or a CMS
    return [
      {
        title: "Data Structures & Algorithms",
        section: "Linked Lists",
        difficulty: "intermediate",
        content: "A linked list is a linear data structure where elements are not stored at contiguous memory locations. The elements in a linked list are linked using pointers..."
      }
    ]
  }

  chunkContent(text: string, options: { chunkSize: number; overlap: number }) {
    const chunks = []
    const sentences = this.splitIntoSentences(text)
    
    let currentChunk: string[] = []
    let currentSize = 0
    
    for (const sentence of sentences) {
      const sentenceSize = sentence.length
      
      if (currentSize + sentenceSize > options.chunkSize && currentChunk.length > 0) {
        // Save current chunk
        chunks.push({
          id: crypto.randomUUID(),
          text: currentChunk.join(' '),
          size: currentSize
        })
        
        // Start new chunk with overlap
        const overlapSentences = currentChunk.slice(-Math.max(1, Math.floor(options.overlap / 50)))
        currentChunk = [...overlapSentences, sentence]
        currentSize = currentChunk.join(' ').length
      } else {
        currentChunk.push(sentence)
        currentSize += sentenceSize
      }
    }
    
    // push last chunk
    if (currentChunk.length > 0) {
        chunks.push({
            id: crypto.randomUUID(),
            text: currentChunk.join(' '),
            size: currentSize
        })
    }
    
    return chunks
  }
  
  splitIntoSentences(text: string): string[] {
    // Smart sentence splitting that preserves code blocks
    const codeBlockPattern = /```[\s\S]*?```/g
    const codeBlocks: string[] = []
    
    // Extract code blocks first
    let processedText = text.replace(codeBlockPattern, (match) => {
      codeBlocks.push(match)
      return `{{CODE_BLOCK_${codeBlocks.length - 1}}}`
    })
    
    // Split into sentences
    const sentences = processedText.split(/(?<=[.!?])\s+/).filter(s => s.trim())
    
    // Restore code blocks
    return sentences.map(sentence => 
      sentence.replace(/{{CODE_BLOCK_(\d+)}}/g, (_, idx) => codeBlocks[parseInt(idx)])
    )
  }
}
