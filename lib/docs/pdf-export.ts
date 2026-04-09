'use client'

import jsPDF from 'jspdf'

/**
 * Export rendered HTML content as a PDF file.
 * Uses jsPDF for text-based PDF generation (lighter than html2canvas pipeline).
 */
export async function exportToPDF(
  markdownContent: string,
  title: string,
  type: string
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const maxWidth = pageWidth - margin * 2
  let y = margin

  // Header
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Unicode Platform — ${type.toUpperCase()} Document`, margin, y)
  y += 4
  doc.setDrawColor(59, 130, 246)
  doc.setLineWidth(0.5)
  doc.line(margin, y, pageWidth - margin, y)
  y += 12

  // Title
  doc.setFontSize(22)
  doc.setTextColor(20, 20, 20)
  doc.text(title, margin, y)
  y += 10

  // Date
  doc.setFontSize(9)
  doc.setTextColor(120, 120, 120)
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, y)
  y += 12

  // Body content
  doc.setFontSize(11)
  doc.setTextColor(30, 30, 30)

  const lines = markdownContent.split('\n')

  for (const line of lines) {
    // Check for page break
    if (y > pageHeight - margin) {
      doc.addPage()
      y = margin
    }

    const cleanLine = line
      .replace(/\*\*/g, '')
      .replace(/`/g, '')
      .replace(/#{1,6}\s*/g, '')

    if (line.startsWith('# ')) {
      y += 4
      doc.setFontSize(18)
      doc.setTextColor(20, 20, 20)
      const wrapped = doc.splitTextToSize(cleanLine, maxWidth)
      doc.text(wrapped, margin, y)
      y += wrapped.length * 8
    } else if (line.startsWith('## ')) {
      y += 3
      doc.setFontSize(15)
      doc.setTextColor(40, 40, 40)
      const wrapped = doc.splitTextToSize(cleanLine, maxWidth)
      doc.text(wrapped, margin, y)
      y += wrapped.length * 7
    } else if (line.startsWith('### ')) {
      y += 2
      doc.setFontSize(13)
      doc.setTextColor(60, 60, 60)
      const wrapped = doc.splitTextToSize(cleanLine, maxWidth)
      doc.text(wrapped, margin, y)
      y += wrapped.length * 6
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      doc.setFontSize(11)
      doc.setTextColor(30, 30, 30)
      const bulletText = `  •  ${cleanLine.substring(2)}`
      const wrapped = doc.splitTextToSize(bulletText, maxWidth - 5)
      doc.text(wrapped, margin, y)
      y += wrapped.length * 5
    } else if (line.startsWith('|')) {
      // Table rows
      doc.setFontSize(9)
      doc.setTextColor(50, 50, 50)
      const wrapped = doc.splitTextToSize(cleanLine, maxWidth)
      doc.text(wrapped, margin, y)
      y += wrapped.length * 4.5
    } else if (cleanLine.trim()) {
      doc.setFontSize(11)
      doc.setTextColor(30, 30, 30)
      const wrapped = doc.splitTextToSize(cleanLine, maxWidth)
      doc.text(wrapped, margin, y)
      y += wrapped.length * 5
    } else {
      y += 3
    }
  }

  // Footer on each page
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }

  doc.save(`${title.replace(/\s+/g, '_')}_${type}.pdf`)
}
