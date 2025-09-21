// Document processing utilities for OCR and data extraction

export function extractStructuredData(text) {
  if (!text || typeof text !== 'string') {
    return {
      caseType: null,
      caseNumber: null,
      courtName: null,
      judgeName: null,
      parties: [],
      caseDetails: text || '',
      importantDates: [],
      legalIssues: [],
      documents: [],
      summary: text || '',
      confidence: 0,
    }
  }

  // Basic patterns for Indian legal documents
  const patterns = {
    caseNumber: /(?:case|matter|petition|appeal|writ)\s*(?:no\.?|number)\s*:?\s*([A-Z0-9/\-]+)/gi,
    courtName: /(?:in\s+the\s+)?(?:court\s+of|high\s+court|supreme\s+court|district\s+court|sessions\s+court)\s+of\s+([^,\n]+)/gi,
    judgeName: /(?:before|hon'ble|honourable)\s+(?:mr\.?|ms\.?|justice|judge)\s+([^,\n]+)/gi,
    caseType: /(?:criminal|civil|family|writ|appeal|revision|bail|anticipatory\s+bail)/gi,
    date: /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{2,4})/gi,
  }

  const extracted = {
    caseType: null,
    caseNumber: null,
    courtName: null,
    judgeName: null,
    parties: [],
    caseDetails: text,
    importantDates: [],
    legalIssues: [],
    documents: [],
    summary: text.substring(0, 500) + (text.length > 500 ? '...' : ''),
    confidence: 0,
  }

  // Extract case number
  const caseNumberMatch = text.match(patterns.caseNumber)
  if (caseNumberMatch) {
    extracted.caseNumber = caseNumberMatch[0].replace(/(?:case|matter|petition|appeal|writ)\s*(?:no\.?|number)\s*:?\s*/gi, '').trim()
  }

  // Extract court name
  const courtMatch = text.match(patterns.courtName)
  if (courtMatch) {
    extracted.courtName = courtMatch[0].replace(/(?:in\s+the\s+)?(?:court\s+of|high\s+court|supreme\s+court|district\s+court|sessions\s+court)\s+of\s+/gi, '').trim()
  }

  // Extract judge name
  const judgeMatch = text.match(patterns.judgeName)
  if (judgeMatch) {
    extracted.judgeName = judgeMatch[0].replace(/(?:before|hon'ble|honourable)\s+(?:mr\.?|ms\.?|justice|judge)\s+/gi, '').trim()
  }

  // Extract case type
  const caseTypeMatch = text.match(patterns.caseType)
  if (caseTypeMatch) {
    extracted.caseType = caseTypeMatch[0].trim()
  }

  // Extract dates
  const dateMatches = text.match(patterns.date)
  if (dateMatches) {
    extracted.importantDates = dateMatches.map(date => ({
      date: new Date(date),
      description: 'Document date',
      type: 'other'
    }))
  }

  // Extract parties (basic pattern)
  const partyPattern = /(?:petitioner|respondent|appellant|defendant|plaintiff|accused)\s*:?\s*([^,\n]+)/gi
  const partyMatches = text.match(partyPattern)
  if (partyMatches) {
    extracted.parties = partyMatches.map(party => {
      const type = party.match(/(petitioner|respondent|appellant|defendant|plaintiff|accused)/i)?.[0]?.toLowerCase() || 'other'
      const name = party.replace(/(?:petitioner|respondent|appellant|defendant|plaintiff|accused)\s*:?\s*/gi, '').trim()
      return { name, type }
    })
  }

  // Calculate confidence based on extracted data
  let confidence = 0
  if (extracted.caseNumber) confidence += 20
  if (extracted.courtName) confidence += 20
  if (extracted.judgeName) confidence += 15
  if (extracted.caseType) confidence += 15
  if (extracted.parties.length > 0) confidence += 20
  if (extracted.importantDates.length > 0) confidence += 10

  extracted.confidence = Math.min(confidence, 100)

  return extracted
}

export function categorizeDocument(extractedData) {
  if (!extractedData || !extractedData.caseType) {
    return 'other'
  }

  const caseType = extractedData.caseType.toLowerCase()
  
  if (caseType.includes('criminal')) return 'criminal'
  if (caseType.includes('civil')) return 'civil'
  if (caseType.includes('family')) return 'family'
  if (caseType.includes('writ')) return 'constitutional'
  if (caseType.includes('bail')) return 'criminal'
  
  return 'other'
}

export function generateSummary(text, maxLength = 200) {
  if (!text || typeof text !== 'string') {
    return ''
  }

  // Simple summarization - take first few sentences
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10)
  let summary = ''
  
  for (const sentence of sentences) {
    if (summary.length + sentence.length > maxLength) {
      break
    }
    summary += sentence.trim() + '. '
  }

  return summary.trim() || text.substring(0, maxLength) + '...'
}