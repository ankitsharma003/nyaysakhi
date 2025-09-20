// Document processing utilities for extracting legal information

const extractCaseNumber = (text) => {
  const patterns = [
    /Case\s*No\.?\s*[A-Z0-9/-]+/gi,
    /Crl\.?\s*No\.?\s*[A-Z0-9/-]+/gi,
    /C\.?\s*No\.?\s*[A-Z0-9/-]+/gi,
    /W\.?\s*P\.?\s*No\.?\s*[A-Z0-9/-]+/gi,
    /S\.?\s*A\.?\s*No\.?\s*[A-Z0-9/-]+/gi,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      return match[0].trim()
    }
  }

  return null
}

const extractJudgeName = (text) => {
  const patterns = [
    /BEFORE\s+HON'BLE\s+([A-Z\s.]+)/gi,
    /HON'BLE\s+([A-Z\s.]+)/gi,
    /JUDGE\s*:?\s*([A-Z\s.]+)/gi,
  ]

  for (const pattern of patterns) {
    const match = pattern.exec(text)
    if (match && match[1] && match[1].trim().length > 2) {
      const name = match[1].trim()
      if (name.split(' ').length >= 2 && /^[A-Z\s.]+$/.test(name)) {
        return name
      }
    }
    pattern.lastIndex = 0
  }

  return null
}

const extractDate = (text) => {
  const patterns = [
    { regex: /(\d{1,2})[-/](\d{1,2})[-/](\d{4})/g, isDDMMYYYY: true },
    {
      regex:
        /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/gi,
      isDDMMYYYY: false,
    },
    {
      regex:
        /(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/gi,
      isDDMMYYYY: false,
    },
  ]

  for (const pattern of patterns) {
    const match = pattern.regex.exec(text)
    if (match) {
      try {
        let date
        if (pattern.isDDMMYYYY) {
          const [, day, month, year] = match
          date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
        } else {
          date = new Date(match[0])
        }

        if (!isNaN(date.getTime())) {
          return date.toISOString()
        }
      } catch (error) {
        continue
      }
    }
    pattern.regex.lastIndex = 0
  }

  return null
}

const extractCaseTitle = (text) => {
  const patterns = [
    /(?:IN THE MATTER OF|BETWEEN|IN RE)\s+([A-Z\s.,&]+)/i,
    /PETITIONER[:\s]+([A-Z\s.,&]+)/i,
    /APPLICANT[:\s]+([A-Z\s.,&]+)/i,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }

  return null
}

const extractCourtName = (text) => {
  const patterns = [
    /(?:HIGH COURT|DISTRICT COURT|SUPREME COURT|SESSIONS COURT|FAMILY COURT|CONSUMER COURT)[\s\w]*/gi,
    /COURT[:\s]+([A-Z\s.,&]+)/i,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      return match[0].trim()
    }
  }

  return null
}

const extractCaseType = (text) => {
  const patterns = [
    /(?:CRIMINAL|CIVIL|WRIT|BAIL|APPEAL|REVISION|REVIEW)[\s\w]*/gi,
    /TYPE[:\s]+([A-Z\s.,&]+)/i,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      return match[0].trim()
    }
  }

  return null
}

const extractCaseStatus = (text) => {
  const patterns = [
    /(?:PENDING|DISPOSED|ADJOURNED|DISMISSED|ALLOWED|REJECTED)[\s\w]*/gi,
    /STATUS[:\s]+([A-Z\s.,&]+)/i,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      return match[0].trim()
    }
  }

  return null
}

const extractParties = (text) => {
  const patterns = [
    /(?:PETITIONER|APPLICANT|COMPLAINANT)[\s\w]*\s+(?:VS|V\.S\.|AGAINST)\s+(?:RESPONDENT|OPPOSITE PARTY|ACCUSED)[\s\w]*/gi,
    /BETWEEN\s+([A-Z\s.,&]+)\s+AND\s+([A-Z\s.,&]+)/gi,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      if (match[1] && match[2]) {
        return [match[1].trim(), match[2].trim()]
      } else {
        return match[0].split(/\s+(?:VS|V\.S\.|AGAINST)\s+/i)
      }
    }
  }

  return null
}

const calculateConfidence = (extractedData, ocrConfidence) => {
  const fields = [
    'caseNumber',
    'caseTitle',
    'judgeName',
    'nextHearingDate',
    'caseStatus',
    'courtName',
    'caseType',
  ]

  const extractedFields = fields.filter((field) => extractedData[field])
  const extractionRate = extractedFields.length / fields.length

  return (ocrConfidence + extractionRate) / 2
}

const extractStructuredData = (text) => {
  const extracted = {}

  // Extract various fields
  extracted.caseNumber = extractCaseNumber(text)
  extracted.caseTitle = extractCaseTitle(text)
  extracted.judgeName = extractJudgeName(text)
  extracted.nextHearingDate = extractDate(text)
  extracted.caseStatus = extractCaseStatus(text)
  extracted.courtName = extractCourtName(text)
  extracted.caseType = extractCaseType(text)
  extracted.parties = extractParties(text)

  return extracted
}

module.exports = {
  extractStructuredData,
  extractCaseNumber,
  extractJudgeName,
  extractDate,
  extractCaseTitle,
  extractCourtName,
  extractCaseType,
  extractCaseStatus,
  extractParties,
  calculateConfidence,
}
