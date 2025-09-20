// Core application types for Nyāy Mitra

export interface Document {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  uploadDate: Date
  status: 'processing' | 'completed' | 'failed'
  extractedData?: ExtractedData
  userId: string
}

export interface ExtractedData {
  caseNumber?: string
  caseTitle?: string
  judgeName?: string
  nextHearingDate?: Date
  caseStatus?: string
  courtName?: string
  caseType?: string
  parties?: string[]
  confidence: number
  rawText: string
  language: 'en' | 'hi'
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  district?: string
  state?: string
  language: 'en' | 'hi'
  createdAt: Date
  updatedAt: Date
}

export interface Lawyer {
  id: string
  name: string
  email: string
  phone: string
  barCouncilNumber: string
  practiceAreas: string[]
  districts: string[]
  languages: string[]
  experience: number
  rating: number
  verified: boolean
  bio?: string
  profileImage?: string
  createdAt: Date
  updatedAt: Date
}

export interface CaseMatch {
  lawyerId: string
  lawyer: Lawyer
  matchScore: number
  reasons: string[]
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  language: 'en' | 'hi'
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface UploadProgress {
  file: File
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'queued' | 'error'
  error?: string
}

export interface Language {
  code: 'en' | 'hi'
  name: string
  nativeName: string
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
]

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SearchParams {
  query?: string
  district?: string
  caseType?: string
  language?: string
  pagination?: PaginationParams
}
