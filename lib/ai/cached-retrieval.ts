import { Redis } from '@upstash/redis'
import { pineconeService } from './pinecone-service'

// Initialize Redis from Environment Variables
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
})

export class CachedRetrieval {
  async getOrSearch(query: string, ttl: number = 3600) {
    // Check cache first
    const cacheKey = `search:${query.toLowerCase().trim()}`
    
    try {
      const cached = await redis.get(cacheKey)
      if (cached) {
        return typeof cached === 'string' ? JSON.parse(cached) : cached
      }
    } catch (error) {
      console.warn('Redis Cache Miss/Error:', error)
    }
    
    // Perform actual search if not cached
    const results = await pineconeService.search(query, 5)
    
    // Cache results (fire and forget)
    redis.setex(cacheKey, ttl, JSON.stringify(results)).catch(console.error)
    
    return results
  }
}

export const cachedRetrieval = new CachedRetrieval()
