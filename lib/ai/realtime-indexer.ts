import { createClient } from '@supabase/supabase-js'
import { embeddingService } from './embeddings'
import { pineconeService } from './pinecone-service'

// Initialize a supabase admin client to listen to database triggers
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export class RealtimeIndexer {
  async setupRealtimeSync() {
    // Listen to Supabase changes
    supabase
      .channel('course_updates')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'Courses' },
        async (payload) => {
          await this.indexNewCourse(payload.new)
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'Courses' },
        async (payload) => {
          console.log('Course updated. Should trigger re-indexing for:', payload.new.id)
        }
      )
      .subscribe()
    
    console.log('Realtime RAG synchronization initialized!')
  }
  
  async indexNewCourse(course: any) {
    if (!course.title || !course.description) return

    // Generate embeddings for new course (assuming sections are passed or fetched)
    const sections = course.sections || [{ title: 'Overview', content: course.description }]
    
    const embeddings = await embeddingService.generateEmbeddings([
      course.title,
      course.description,
      ...sections.map((s: any) => s.content)
    ])
    
    // Upsert to Pinecone
    await pineconeService.upsertVectors(
      sections.map((section: any, i: number) => ({
        id: `course-${course.id}-${i}`,
        values: embeddings[i + 2],
        metadata: {
          type: 'course' as const,
          title: course.title,
          content: section.content,
          courseId: course.id
        }
      }))
    )
    
    console.log(`Successfully indexed new course: ${course.title}`)
  }
}

export const realtimeIndexer = new RealtimeIndexer()
