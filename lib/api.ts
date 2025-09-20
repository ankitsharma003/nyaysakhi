// lib/api-client.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

type ApiResponse<T = any> = { data: T; success: boolean; message?: string }

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    // initialize token from localStorage if available (client-side)
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken')
    }
  }

  private getAuthToken(): string | null {
    // always prefer the in-memory token, but fall back to localStorage
    if (this.token) return this.token
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken')
    }
    return null
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

    const token = this.getAuthToken()
    const userLang =
      typeof window !== 'undefined'
        ? localStorage.getItem('appLanguage') || 'en'
        : 'en'

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Accept-Language': userLang,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // allow options.headers to override if explicitly provided (cast because RequestInit.headers can be many forms)
      ...(options.headers as Record<string, string> | undefined),
    }

    const config: RequestInit = {
      ...options,
      headers,
    }

    try {
      const response = await fetch(url, config)

      // handle empty responses or non-JSON responses gracefully
      const text = await response.text()
      let parsed: any = null
      try {
        parsed = text ? JSON.parse(text) : null
      } catch (e) {
        // not JSON — return text as message
        parsed = { message: text }
      }

      if (!response.ok) {
        const message =
          (parsed && parsed.message) || response.statusText || 'Request failed'
        throw new Error(message)
      }

      // Conform to ApiResponse<T> shape if backend returns that shape, otherwise try to normalize
      if (
        parsed &&
        typeof parsed === 'object' &&
        ('data' in parsed || 'success' in parsed)
      ) {
        return parsed as ApiResponse<T>
      }

      return { data: parsed as T, success: true } as ApiResponse<T>
    } catch (error: any) {
      console.error('API request failed:', error)
      // Re-throw the error so callers can handle it
      throw error
    }
  }

  // -----------------------
  // Auth methods
  // -----------------------
  async register(userData: {
    name: string
    email: string
    password: string
    phone?: string
    role?: 'user' | 'lawyer'
    district?: string
    state?: string
    language?: 'en' | 'hi' | string
    barCouncilNumber?: string
    practiceAreas?: string[]
    districts?: string[]
    languages?: string[]
    bio?: string
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    const token =
      (response.data as any)?.session?.token ?? (response.data as any)?.token
    if (token) {
      this.setToken(token)
    }

    return response
  }

  async verify2FA(data: { email: string; code: string }) {
    const response = await this.request('/auth/verify-2fa', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    const token =
      (response.data as any)?.session?.token ?? (response.data as any)?.token
    if (token) {
      this.setToken(token)
    }

    return response
  }

  async getCurrentUser() {
    return this.request('/auth/me')
  }

  async refreshToken() {
    const refreshToken =
      typeof window !== 'undefined'
        ? localStorage.getItem('refreshToken')
        : null

    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })

    const token = (response.data as any)?.token
    if (token) {
      this.setToken(token)
    }

    return response
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' })
    } finally {
      this.clearToken()
    }
  }

  async logoutAll() {
    try {
      await this.request('/auth/logout-all', { method: 'POST' })
    } finally {
      this.clearToken()
    }
  }

  async getSessions() {
    return this.request('/auth/sessions')
  }

  async revokeSession(sessionId: string) {
    return this.request(`/auth/sessions/${sessionId}`, { method: 'DELETE' })
  }

  async enable2FA() {
    return this.request('/auth/enable-2fa', { method: 'POST' })
  }

  async verifyEnable2FA(code: string) {
    return this.request('/auth/verify-enable-2fa', {
      method: 'POST',
      body: JSON.stringify({ code }),
    })
  }

  async disable2FA(password: string) {
    return this.request('/auth/disable-2fa', {
      method: 'POST',
      body: JSON.stringify({ password }),
    })
  }

  // -----------------------
  // User methods
  // -----------------------
  async updateProfile(userData: {
    name?: string
    phone?: string
    district?: string
    state?: string
    language?: 'en' | 'hi' | string
  }) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    return this.request('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async getUserStats() {
    return this.request('/users/stats')
  }

  async deactivateAccount(password: string) {
    return this.request('/users/me', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    })
  }

  // -----------------------
  // Privacy / Auth utilities
  // -----------------------
  async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async resetPassword(token: string, password: string) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    })
  }

  async updatePrivacySettings(settings: any) {
    return this.request('/privacy/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    })
  }

  async createDataRequest(type: string) {
    return this.request('/privacy/data-request', {
      method: 'POST',
      body: JSON.stringify({ type }),
    })
  }

  async revokeConsent(consentId: string) {
    return this.request(`/privacy/consent/${consentId}/revoke`, {
      method: 'POST',
    })
  }

  // -----------------------
  // FAQ methods
  // -----------------------
  async getFAQs(params?: {
    category?: string
    language?: string
    limit?: number
  }) {
    const queryParams = new URLSearchParams()
    if (params?.category) queryParams.append('category', params.category)
    if (params?.language) queryParams.append('language', params.language)
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const queryString = queryParams.toString()
    return this.request(`/faqs${queryString ? `?${queryString}` : ''}`)
  }

  async getFAQCategories(language?: string) {
    const queryParams = new URLSearchParams()
    if (language) queryParams.append('language', language)

    const queryString = queryParams.toString()
    return this.request(
      `/faqs/categories${queryString ? `?${queryString}` : ''}`
    )
  }

  async searchFAQs(query: string, language?: string, limit?: number) {
    const queryParams = new URLSearchParams()
    queryParams.append('q', query)
    if (language) queryParams.append('language', language)
    if (limit) queryParams.append('limit', limit.toString())

    const queryString = queryParams.toString()
    return this.request(`/faqs/search?${queryString}`)
  }

  // -----------------------
  // Lawyer methods
  // -----------------------
  async getLawyers(params?: {
    page?: number
    limit?: number
    district?: string
    practiceArea?: string
    language?: string
    verified?: boolean
    minRating?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value))
        }
      })
    }

    const queryString = queryParams.toString()
    return this.request(`/lawyers${queryString ? `?${queryString}` : ''}`)
  }

  async getLawyer(id: string) {
    return this.request(`/lawyers/${id}`)
  }

  async registerLawyer(lawyerData: {
    barCouncilNumber: string
    practiceAreas: string[]
    districts: string[]
    languages: string[]
    experience?: number
    bio?: string
    consultationFee?: number
    specializations?: string[]
    education?: Array<{
      degree: string
      institution: string
      year: number
      grade?: string
    }>
    achievements?: Array<{ title: string; description: string; year: number }>
    socialLinks?: { website?: string; linkedin?: string; twitter?: string }
  }) {
    return this.request('/lawyers/register', {
      method: 'POST',
      body: JSON.stringify(lawyerData),
    })
  }

  async updateLawyerProfile(lawyerData: {
    practiceAreas?: string[]
    districts?: string[]
    languages?: string[]
    experience?: number
    bio?: string
    consultationFee?: number
    specializations?: string[]
    education?: Array<{
      degree: string
      institution: string
      year: number
      grade?: string
    }>
    achievements?: Array<{ title: string; description: string; year: number }>
    socialLinks?: { website?: string; linkedin?: string; twitter?: string }
  }) {
    return this.request('/lawyers/me', {
      method: 'PUT',
      body: JSON.stringify(lawyerData),
    })
  }

  async getLawyerMatches(documentId: string) {
    return this.request(`/lawyers/matches/${documentId}`)
  }

  async getLawyerCases(params?: {
    page?: number
    limit?: number
    status?: string
  }) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value))
        }
      })
    }
    const queryString = queryParams.toString()
    return this.request(`/lawyers/cases${queryString ? `?${queryString}` : ''}`)
  }

  async updateCaseStatus(
    caseId: string,
    data: { status: string; notes?: string }
  ) {
    return this.request(`/lawyers/cases/${caseId}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async getLawyerStats() {
    return this.request('/lawyers/stats')
  }

  // -----------------------
  // Document methods
  // -----------------------
  async uploadDocument(formData: FormData) {
    const token = this.getAuthToken()
    const url = `${this.baseURL}/documents/upload`
    const response = await fetch(url, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    })

    if (!response.ok) {
      const text = await response.text()
      let err
      try {
        err = JSON.parse(text)
      } catch {
        err = { message: text || 'Upload failed' }
      }
      throw new Error(err.message || 'Upload failed')
    }

    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch {
      return { message: text } as any
    }
  }

  async getDocuments(params?: {
    page?: number
    limit?: number
    status?: string
    category?: string
    language?: string
  }) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value))
        }
      })
    }

    const queryString = queryParams.toString()
    return this.request(`/documents${queryString ? `?${queryString}` : ''}`)
  }

  async getDocument(id: string) {
    return this.request(`/documents/${id}`)
  }

  async updateDocument(id: string, data: any) {
    return this.request(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteDocument(id: string) {
    return this.request(`/documents/${id}`, { method: 'DELETE' })
  }

  // -----------------------
  // Utility methods
  // -----------------------
  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
    }
  }

  getToken() {
    return this.getAuthToken()
  }

  isAuthenticated() {
    return !!this.getAuthToken()
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
export default apiClient
