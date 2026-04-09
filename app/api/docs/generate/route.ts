import { NextRequest, NextResponse } from 'next/server'
import { groqService } from '@/lib/ai/groq-service'

const DOC_PROMPTS: Record<string, string> = {
  srs: `You are an expert software requirements analyst. Generate a comprehensive IEEE-830 standard Software Requirements Specification (SRS) document in Markdown.

Include these sections with proper formatting:
1. **Introduction** (Purpose, Scope, Definitions, References)
2. **Overall Description** (Product Perspective, Product Functions, User Classes, Operating Environment, Constraints)
3. **System Features** (Each feature with description, priority, stimulus/response, functional requirements)
4. **External Interface Requirements** (User Interfaces, Hardware Interfaces, Software Interfaces, Communication Interfaces)
5. **Non-Functional Requirements** (Performance, Safety, Security, Quality Attributes)
6. **Use Cases** (At least 3 detailed use cases with actors, preconditions, main flow, alternate flows, postconditions)
7. **Appendix** (Data dictionary, glossary)

Use proper markdown headers, tables, and bullet points. Be thorough and professional.`,

  uml: `You are an expert software architect. Generate UML diagrams using Mermaid.js syntax.

For each diagram type requested, output the Mermaid code inside a fenced code block with language "mermaid".

Generate these diagrams:
1. **Class Diagram** - Show classes with attributes, methods, and relationships
2. **Sequence Diagram** - Show interactions between objects over time
3. **Entity-Relationship Diagram** - Show database entities and relationships
4. **Use Case Diagram** - Show actors and their interactions

Each diagram should be wrapped in a mermaid code block like:
\`\`\`mermaid
classDiagram
  class Example {
    +String name
    +getName() String
  }
\`\`\`

Provide explanations between diagrams. Make diagrams realistic and detailed.`,

  api: `You are an expert API documentation writer. Generate comprehensive API documentation in Markdown following OpenAPI/Swagger conventions.

Include:
1. **API Overview** (Base URL, versioning, response format)
2. **Authentication** (Method, token format, examples)
3. **Endpoints** - For each endpoint include:
   - HTTP method and path
   - Description
   - Request headers/parameters in a table
   - Request body (JSON example)
   - Response body (JSON example with status codes)
   - Error responses
4. **Error Codes** (Table of all error codes and descriptions)
5. **Rate Limiting** (Limits, headers, retry strategy)
6. **SDK Examples** (Code snippets in JS/Python)

Use tables, code blocks, and proper formatting extensively.`,

  ppt: `You are an expert presentation designer. Generate slide content for a professional presentation.

Output EXACTLY in this format for each slide:
---SLIDE---
## [Slide Title]
- Bullet point 1
- Bullet point 2
- Bullet point 3
**Speaker Notes:** [Brief notes for the presenter]
---END SLIDE---

Create 10-15 slides covering:
1. Title Slide (with subtitle)
2. Agenda/Overview
3-4. Problem Statement / Background
5-8. Key Content / Solution / Features
9-10. Technical Details / Architecture
11-12. Implementation / Demo
13. Results / Benefits
14. Next Steps / Roadmap
15. Q&A / Thank You

Make content engaging, concise, and professional. Use action-oriented language.`,

  report: `You are an expert technical writer. Generate a detailed professional report in Markdown.

Include these sections:
1. **Executive Summary** (Concise overview of findings and recommendations)
2. **Introduction** (Background, objectives, scope, methodology)
3. **Literature Review / Background** (Relevant context and prior work)
4. **Methodology** (Approach, tools, data sources)
5. **Findings / Analysis** (Detailed results with sub-sections)
6. **Discussion** (Interpretation, implications, limitations)
7. **Recommendations** (Actionable recommendations with priority)
8. **Conclusion** (Summary of key points)
9. **References** (Properly formatted citations)
10. **Appendices** (Supporting data, charts)

Use tables, bullet points, and proper academic formatting. Be thorough and evidence-based.`
}

export async function POST(req: NextRequest) {
  try {
    const { type, title, description, requirements, code } = await req.json()

    if (!type || !title || !description) {
      return NextResponse.json(
        { error: 'Type, title, and description are required' },
        { status: 400 }
      )
    }

    const systemPrompt = DOC_PROMPTS[type]
    if (!systemPrompt) {
      return NextResponse.json(
        { error: `Invalid document type: ${type}` },
        { status: 400 }
      )
    }

    let userPrompt = `Generate a ${type.toUpperCase()} document for:\n\n**Title:** ${title}\n**Description:** ${description}`
    if (requirements && requirements.length > 0) {
      userPrompt += `\n**Requirements:** ${requirements.join(', ')}`
    }
    if (code) {
      userPrompt += `\n\n**Source Code/Schema:**\n\`\`\`\n${code}\n\`\`\``
    }

    const response = await groqService.chat(
      [{ role: 'user', content: userPrompt }],
      { persona: 'tutor' as any }
    )

    // Override system prompt by using Groq directly
    const Groq = (await import('groq-sdk')).default
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.6,
      max_tokens: 8000,
    })

    const content = completion.choices[0]?.message?.content || ''

    return NextResponse.json({ content, model: 'llama-3.3-70b-versatile' })
  } catch (error) {
    console.error('Doc generation error:', error)
    return NextResponse.json(
      { error: `Generation failed: ${String(error)}` },
      { status: 500 }
    )
  }
}
