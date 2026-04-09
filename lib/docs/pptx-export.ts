'use client'

import PptxGenJS from 'pptxgenjs'

/**
 * Parse AI-generated slide content and export as PPTX.
 * Expected format uses ---SLIDE--- and ---END SLIDE--- delimiters.
 */
export async function exportToPPTX(
  content: string,
  title: string
): Promise<void> {
  const pptx = new PptxGenJS()
  
  pptx.author = 'Unicode Platform'
  pptx.company = 'Unicode Academic OS'
  pptx.subject = title
  pptx.title = title

  // Define color scheme
  const colors = {
    bg: '0A0A0B',
    accent: '3B82F6',
    text: 'E2E8F0',
    subtext: '94A3B8',
    heading: 'FFFFFF',
    bulletBg: '1E293B',
  }

  // Parse slides from AI output
  const slideBlocks = content.split('---SLIDE---').filter(s => s.trim())

  for (let i = 0; i < slideBlocks.length; i++) {
    const block = slideBlocks[i].replace('---END SLIDE---', '').trim()
    const lines = block.split('\n').filter(l => l.trim())
    
    const slide = pptx.addSlide()
    slide.background = { color: colors.bg }

    // Find title (## heading)
    const titleLine = lines.find(l => l.startsWith('## ') || l.startsWith('# '))
    const slideTitle = titleLine?.replace(/^#{1,3}\s*/, '') || `Slide ${i + 1}`

    // Get bullet points
    const bullets = lines
      .filter(l => l.startsWith('- ') || l.startsWith('* '))
      .map(l => l.replace(/^[-*]\s*/, '').replace(/\*\*/g, ''))

    // Get speaker notes
    const notesLine = lines.find(l => l.startsWith('**Speaker Notes:**'))
    const notes = notesLine?.replace('**Speaker Notes:**', '').trim() || ''

    if (i === 0) {
      // Title slide
      slide.addText(slideTitle, {
        x: 0.8, y: 1.5, w: 8.4, h: 1.5,
        fontSize: 36, bold: true, color: colors.heading,
        align: 'center', fontFace: 'Arial'
      })

      // Accent bar
      slide.addShape(pptx.ShapeType.rect, {
        x: 3.5, y: 3.2, w: 3, h: 0.05,
        fill: { color: colors.accent }
      })

      if (bullets.length > 0) {
        slide.addText(bullets[0], {
          x: 1.5, y: 3.5, w: 7, h: 0.8,
          fontSize: 18, color: colors.subtext,
          align: 'center', fontFace: 'Arial'
        })
      }

      slide.addText('Unicode Academic Platform', {
        x: 0.5, y: 5, w: 9, h: 0.4,
        fontSize: 12, color: colors.subtext,
        align: 'center', fontFace: 'Arial'
      })
    } else {
      // Content slide - Title
      slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: 10, h: 1.2,
        fill: { color: '111827' }
      })

      slide.addText(slideTitle, {
        x: 0.6, y: 0.2, w: 8.8, h: 0.8,
        fontSize: 24, bold: true, color: colors.heading,
        fontFace: 'Arial'
      })

      // Accent underline
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.6, y: 1.15, w: 2, h: 0.04,
        fill: { color: colors.accent }
      })

      // Bullet items
      if (bullets.length > 0) {
        const bulletItems = bullets.map(b => ({
          text: b,
          options: {
            fontSize: 16,
            color: colors.text,
            bullet: { type: 'bullet' as const, color: colors.accent },
            spacing: { before: 8, after: 4 },
          }
        }))

        slide.addText(bulletItems as any, {
          x: 0.8, y: 1.5, w: 8.4, h: 4,
          fontFace: 'Arial', valign: 'top',
        })
      }

      // Slide number
      slide.addText(`${i + 1}`, {
        x: 9, y: 5.1, w: 0.6, h: 0.3,
        fontSize: 10, color: colors.subtext,
        align: 'right', fontFace: 'Arial'
      })
    }

    if (notes) {
      slide.addNotes(notes)
    }
  }

  await pptx.writeFile({ fileName: `${title.replace(/\s+/g, '_')}_presentation.pptx` })
}
