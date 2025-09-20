import {
  formatFileSize,
  formatDate,
  generateId,
  validateEmail,
  validatePhone,
  extractCaseNumber,
  extractJudgeName,
  extractDate,
} from '@/lib/utils'

describe('Utility Functions', () => {
  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1048576)).toBe('1 MB')
      expect(formatFileSize(1073741824)).toBe('1 GB')
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toContain('January')
      expect(formatted).toContain('2024')
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
      expect(id1.length).toBe(9)
    })
  })

  describe('validateEmail', () => {
    it('should validate email addresses correctly', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validatePhone', () => {
    it('should validate Indian phone numbers correctly', () => {
      expect(validatePhone('9876543210')).toBe(true)
      expect(validatePhone('+91-9876543210')).toBe(false) // contains country code
      expect(validatePhone('1234567890')).toBe(false) // starts with 1
      expect(validatePhone('987654321')).toBe(false) // too short
    })
  })

  describe('extractCaseNumber', () => {
    it('should extract case numbers from text', () => {
      const text1 = 'Case No. ABC123/2024'
      const text2 = 'Crl. No. XYZ456/2024'
      const text3 = 'No case number here'

      expect(extractCaseNumber(text1)).toBe('Case No. ABC123/2024')
      expect(extractCaseNumber(text2)).toBe('Crl. No. XYZ456/2024')
      expect(extractCaseNumber(text3)).toBeNull()
    })
  })

  describe('extractJudgeName', () => {
    it('should extract judge names from text', () => {
      const text1 = "BEFORE HON'BLE JUSTICE JOHN DOE"
      const text2 = "HON'BLE JUDGE JANE SMITH"
      const text3 = 'No judge name here'

      expect(extractJudgeName(text1)).toBe('JUSTICE JOHN DOE')
      expect(extractJudgeName(text2)).toBe('JUDGE JANE SMITH')
      expect(extractJudgeName(text3)).toBeNull()
    })
  })

  describe('extractDate', () => {
    it('should extract dates from text', () => {
      const text1 = '15/01/2024'
      const text2 = '15 January 2024'
      const text3 = 'No date here'

      expect(extractDate(text1)).toBeInstanceOf(Date)
      expect(extractDate(text2)).toBeInstanceOf(Date)
      expect(extractDate(text3)).toBeNull()
    })
  })
})
