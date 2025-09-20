import Tesseract from 'tesseract.js'
import { ExtractedData } from '@/types'
import { extractCaseNumber, extractJudgeName, extractDate } from '@/lib/utils'

export interface ProcessingOptions {
  language?: 'eng' | 'hin'
  confidence?: number
  psm?: number
}

export class DocumentProcessor {
  private static instance: DocumentProcessor
  private worker: Tesseract.Worker | null = null

  constructor() {}

  static getInstance(): DocumentProcessor {
    if (!DocumentProcessor.instance) {
      DocumentProcessor.instance = new DocumentProcessor()
    }
    return DocumentProcessor.instance
  }

  async initializeWorker(language: 'eng' | 'hin' = 'eng'): Promise<void> {
    if (this.worker) {
      await this.worker.terminate()
    }

    this.worker = await Tesseract.createWorker({
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`)
        }
      },
    })

    await this.worker.loadLanguage(language)
    await this.worker.initialize(language)
    await this.worker.setParameters({
      tessedit_pageseg_mode: Tesseract.PSM.AUTO,
      tessedit_char_whitelist:
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,-/:()[]{}"\' ',
    })
  }

  async processDocument(
    file: File,
    options: ProcessingOptions = {}
  ): Promise<ExtractedData> {
    const { language = 'eng', confidence = 0.5 } = options

    try {
      // Initialize worker if not already done
      if (!this.worker) {
        await this.initializeWorker(language)
      }

      // Perform OCR
      const { data } = await this.worker!.recognize(file)
      const rawText = data.text

      // Extract structured data using regex patterns
      const extractedData = this.extractStructuredData(rawText, confidence)

      return {
        ...extractedData,
        rawText,
        language: language === 'hin' ? 'hi' : 'en',
        confidence: this.calculateOverallConfidence(
          extractedData,
          data.confidence
        ),
      }
    } catch (error) {
      console.error('Error processing document:', error)
      throw new Error('Failed to process document')
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private extractStructuredData(
    text: string,
    minConfidence: number
  ): Partial<ExtractedData> {
    const extracted: Partial<ExtractedData> = {}

    // Extract case number
    const caseNumber = extractCaseNumber(text)
    if (caseNumber) {
      extracted.caseNumber = caseNumber
    }

    // Extract judge name
    const judgeName = extractJudgeName(text)
    if (judgeName) {
      extracted.judgeName = judgeName
    }

    // Extract dates
    const hearingDate = extractDate(text)
    if (hearingDate) {
      extracted.nextHearingDate = hearingDate
    }

    // Extract case title (look for patterns like "IN THE MATTER OF" or "BETWEEN")
    const caseTitleMatch = text.match(
      /(?:IN THE MATTER OF|BETWEEN|IN RE)\s+([A-Z\s.,&]+)/i
    )
    if (caseTitleMatch) {
      extracted.caseTitle = caseTitleMatch[1].trim()
    }

    // Extract court name (look for patterns like "HIGH COURT", "DISTRICT COURT", etc.)
    const courtMatch = text.match(
      /(?:HIGH COURT|DISTRICT COURT|SUPREME COURT|SESSIONS COURT|FAMILY COURT|CONSUMER COURT)[\s\w]*/i
    )
    if (courtMatch) {
      extracted.courtName = courtMatch[0].trim()
    }

    // Extract case type (criminal, civil, writ, etc.)
    const caseTypeMatch = text.match(
      /(?:CRIMINAL|CIVIL|WRIT|BAIL|APPEAL|REVISION|REVIEW)[\s\w]*/i
    )
    if (caseTypeMatch) {
      extracted.caseType = caseTypeMatch[0].trim()
    }

    // Extract case status
    const statusMatch = text.match(
      /(?:PENDING|DISPOSED|ADJOURNED|DISMISSED|ALLOWED|REJECTED)[\s\w]*/i
    )
    if (statusMatch) {
      extracted.caseStatus = statusMatch[0].trim()
    }

    // Extract parties (look for patterns like "Petitioner" vs "Respondent")
    const partiesMatch = text.match(
      /(?:PETITIONER|APPLICANT|COMPLAINANT)[\s\w]*\s+(?:VS|V\.S\.|AGAINST)\s+(?:RESPONDENT|OPPOSITE PARTY|ACCUSED)[\s\w]*/i
    )
    if (partiesMatch) {
      extracted.parties = partiesMatch[0].split(/\s+(?:VS|V\.S\.|AGAINST)\s+/i)
    }

    return extracted
  }

  private calculateOverallConfidence(
    extracted: Partial<ExtractedData>,
    ocrConfidence: number
  ): number {
    const fields = [
      'caseNumber',
      'caseTitle',
      'judgeName',
      'nextHearingDate',
      'caseStatus',
      'courtName',
      'caseType',
    ]

    const extractedFields = fields.filter(
      (field) => extracted[field as keyof ExtractedData]
    )
    const extractionRate = extractedFields.length / fields.length

    // Combine OCR confidence with extraction rate
    return (ocrConfidence + extractionRate) / 2
  }

  async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate()
      this.worker = null
    }
  }

  // Static method for one-time processing
  static async processDocumentOnce(
    file: File,
    options: ProcessingOptions = {}
  ): Promise<ExtractedData> {
    const processor = new DocumentProcessor()
    try {
      return await processor.processDocument(file, options)
    } finally {
      await processor.terminate()
    }
  }
}

// Utility function for batch processing
export async function processMultipleDocuments(
  files: File[],
  options: ProcessingOptions = {}
): Promise<ExtractedData[]> {
  const processor = DocumentProcessor.getInstance()
  const results: ExtractedData[] = []

  for (const file of files) {
    try {
      const result = await processor.processDocument(file, options)
      results.push(result)
    } catch (error) {
      console.error(`Error processing ${file.name}:`, error)
      // Add a failed result
      results.push({
        rawText: '',
        language: 'en',
        confidence: 0,
        caseNumber: undefined,
        caseTitle: undefined,
        judgeName: undefined,
        nextHearingDate: undefined,
        caseStatus: undefined,
        courtName: undefined,
        caseType: undefined,
        parties: undefined,
      })
    }
  }

  return results
}

// Utility function to validate file type
export function validateFileType(file: File): boolean {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/tiff',
  ]

  return allowedTypes.includes(file.type)
}

// Utility function to validate file size
export function validateFileSize(file: File, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}
