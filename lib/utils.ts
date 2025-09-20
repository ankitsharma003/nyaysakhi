import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateHindi(date: Date | string): string {
  const d = new Date(date)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    calendar: 'indian',
  }
  return d.toLocaleDateString('hi-IN', options)
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/
  const cleanedPhone = phone.replace(/\D/g, '')
  return phoneRegex.test(cleanedPhone) && cleanedPhone.length === 10
}

export function extractCaseNumber(text: string): string | null {
  // Common case number patterns in Indian courts
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

export function extractJudgeName(text: string): string | null {
  // Common judge name patterns
  const patterns = [
    /BEFORE\s+HON'BLE\s+([A-Z\s.]+)/gi,
    /HON'BLE\s+([A-Z\s.]+)/gi,
    /JUDGE\s*:?\s*([A-Z\s.]+)/gi,
  ]

  for (const pattern of patterns) {
    const match = pattern.exec(text)
    if (match && match[1] && match[1].trim().length > 2) {
      const name = match[1].trim()
      // Additional validation to ensure it's a proper name
      if (name.split(' ').length >= 2 && /^[A-Z\s.]+$/.test(name)) {
        return name
      }
    }
    // Reset lastIndex for global regex
    pattern.lastIndex = 0
  }

  return null
}

export function extractDate(text: string): Date | null {
  // Common date patterns in Indian legal documents
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
        let date: Date
        if (pattern.isDDMMYYYY) {
          // Handle DD/MM/YYYY format
          const [, day, month, year] = match
          date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
        } else {
          // Handle other formats
          date = new Date(match[0])
        }

        if (!isNaN(date.getTime())) {
          return date
        }
      } catch (error) {
        continue
      }
    }
    // Reset lastIndex for global regex
    pattern.regex.lastIndex = 0
  }

  return null
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
