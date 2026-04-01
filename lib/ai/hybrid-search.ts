import { pineconeService } from './pinecone-service'

// Mocking Supabase full-text search for the hybrid demonstration.
// In production, this would use the real Supabase client to perform a text-search query.
async function keywordSearch(query: string, topK: number) {
  console.log('Performing keyword search for:', query)
  return []
}

export class HybridSearchService {
  async hybridSearch(
    query: string,
    topK: number = 5,
    alpha: number = 0.5  // Balance between semantic and keyword (1.0 = 100% semantic)
  ) {
    // 1. Semantic search with Pinecone
    const semanticResults = await pineconeService.search(query, topK * 2)
    
    // 2. Keyword search (using Supabase full-text search)
    const keywordResults = await keywordSearch(query, topK * 2)
    
    // 3. Combine and rerank using Reciprocal Rank Fusion (RRF)
    const combined = this.rrfFusion(semanticResults, keywordResults, alpha)
    
    return combined.slice(0, topK)
  }
  
  private rrfFusion(
    semantic: any[], 
    keyword: any[], 
    alpha: number
  ): any[] {
    const scores = new Map()
    
    // RRF formula: 1/(k + rank)
    const k = 60
    
    semantic.forEach((result, rank) => {
      const score = alpha * (1 / (k + rank + 1))
      scores.set(result.id, {
        ...result,
        score: (scores.get(result.id)?.score || 0) + score
      })
    })
    
    keyword.forEach((result, rank) => {
      const score = (1 - alpha) * (1 / (k + rank + 1))
      scores.set(result.id, {
        ...result,
        score: (scores.get(result.id)?.score || 0) + score
      })
    })
    
    return Array.from(scores.values()).sort((a, b) => b.score - a.score)
  }
}

export const hybridSearchService = new HybridSearchService()
