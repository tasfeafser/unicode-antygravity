import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { code, language, fileName, summary, prompt, templateId, courseContext, language: lang } = body

    // Simulate AI generation delay (realistic 1.5-3s)
    const delay = 1500 + Math.random() * 1500
    await new Promise(r => setTimeout(r, delay))

    // Build a fake generation log for streaming display
    const generationLog = [
      '✦ Analyzing topic and selecting template...',
      '✦ Generating slide structure...',
      '  → Title slide created',
      '  → Introduction slide created',
      '  → Content slides (1-8) created',
      '  → Summary slide created',
      '✦ Applying Unicode theme...',
      '✦ Adding code examples...',
      '✦ Optimizing layout...',
      '✓ Generation complete!',
    ]

    const name = fileName || prompt?.slice(0, 30) || 'presentation'

    return NextResponse.json({
      success: true,
      message: 'Presentation generated successfully',
      generationId: `gen_${Date.now()}`,
      downloadUrl: '#',
      previewUrl: '#',
      fileName: `${name.replace(/\s+/g, '_')}_unicode.pptx`,
      slides: 10,
      log: generationLog,
    })

  } catch (error) {
    console.error('PPT Generation Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
