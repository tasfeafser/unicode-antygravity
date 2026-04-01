import { NextRequest, NextResponse } from 'next/server'

// Piston API is a free execution engine for multiple languages
const PISTON_URL = 'https://emkc.org/api/v2/piston'

const LANGUAGE_VERSIONS = {
  python: '3.10.0',
  javascript: '18.15.0',
  java: '15.0.2',
  cpp: '10.2.0',
  rust: '1.68.2'
}

export async function POST(req: NextRequest) {
  try {
    const { language, source, input } = await req.json()

    if (!language || !source) {
      return new NextResponse('Language and source code are required', { status: 400 })
    }

    const version = LANGUAGE_VERSIONS[language as keyof typeof LANGUAGE_VERSIONS]
    
    if (!version) {
      return new NextResponse(`Language ${language} is not supported`, { status: 400 })
    }

    const payload = {
      language,
      version,
      files: [{ content: source }],
      stdin: input || '',
    }

    const response = await fetch(`${PISTON_URL}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Execution Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
