'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { apiClient } from './api'

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role: 'user' | 'lawyer' | 'admin'
  district?: string
  state?: string
  language: 'en' | 'hi'
  avatar?: string
  isVerified: boolean
  isActive: boolean
  twoFactorEnabled: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

interface LawyerProfile {
  _id: string
  user: string
  barCouncilNumber: string
  practiceAreas: string[]
  districts: string[]
  languages: string[]
  experience: number
  rating: number
  totalReviews: number
  bio?: string
  profileImage?: string
  isVerified: boolean
  consultationFee: number
  specializations: string[]
  education: Array<{
    degree: string
    institution: string
    year: number
    grade?: string
  }>
  achievements: Array<{
    title: string
    description: string
    year: number
  }>
  socialLinks: {
    website?: string
    linkedin?: string
    twitter?: string
  }
  isActive: boolean
  lastActive: string
  totalCases: number
  successfulCases: number
  responseTime: number
  successRate: number
}

interface Session {
  _id: string
  user: string
  token: string
  refreshToken: string
  expiresAt: string
  deviceInfo: {
    type: 'desktop' | 'mobile' | 'tablet'
    os: string
    browser: string
    location?: string
  }
  ipAddress: string
  userAgent: string
  isActive: boolean
  lastActivity: string
  createdAt: string
  updatedAt: string
}

interface AuthContextType {
  user: User | null
  lawyerProfile: LawyerProfile | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => Promise<void>
  logoutAll: () => Promise<void>
  updateProfile: (userData: any) => Promise<void>
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>
  refreshUser: () => Promise<void>
  verify2FA: (email: string, code: string) => Promise<void>
  enable2FA: () => Promise<any>
  verifyEnable2FA: (code: string) => Promise<void>
  disable2FA: (password: string) => Promise<void>
  getSessions: () => Promise<Session[]>
  revokeSession: (sessionId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [lawyerProfile, setLawyerProfile] = useState<LawyerProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user && !!session

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)
      // Only check auth if we have a token
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
      if (token && apiClient.isAuthenticated()) {
        const response = await apiClient.getCurrentUser()
        if (response.success) {
          const data = response.data as any
          setUser(data.user)
          setSession(data.session)
          if (data.lawyerProfile) {
            setLawyerProfile(data.lawyerProfile)
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      // Clear invalid token but don't block page access
      apiClient.clearToken()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await apiClient.login({ email, password })

      if (response.success) {
        const data = response.data as any
        if (data.requiresTwoFactor) {
          // Handle 2FA requirement
          throw new Error('2FA_REQUIRED')
        }

        setUser(data.user)
        setSession(data.session)

        if (data.lawyerProfile) {
          setLawyerProfile(data.lawyerProfile)
        }
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: any) => {
    try {
      setIsLoading(true)
      const response = await apiClient.register(userData)

      if (response.success) {
        // Registration successful, user needs to verify email
        return
      }
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await apiClient.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setUser(null)
      setLawyerProfile(null)
      setSession(null)
      apiClient.clearToken()
    }
  }

  const logoutAll = async () => {
    try {
      await apiClient.logoutAll()
    } catch (error) {
      console.error('Logout all failed:', error)
    } finally {
      setUser(null)
      setLawyerProfile(null)
      setSession(null)
      apiClient.clearToken()
    }
  }

  const updateProfile = async (userData: any) => {
    try {
      const response = await apiClient.updateProfile(userData)

      if (response.success) {
        setUser(response.data as any)
      }
    } catch (error) {
      console.error('Update profile failed:', error)
      throw error
    }
  }

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      const response = await apiClient.changePassword({
        currentPassword,
        newPassword,
      })

      if (response.success) {
        return
      }
    } catch (error) {
      console.error('Change password failed:', error)
      throw error
    }
  }

  const refreshUser = async () => {
    try {
      const response = await apiClient.getCurrentUser()

      if (response.success) {
        const data = response.data as any
        setUser(data.user)
        setSession(data.session)

        if (data.lawyerProfile) {
          setLawyerProfile(data.lawyerProfile)
        }
      }
    } catch (error) {
      console.error('Refresh user failed:', error)
      throw error
    }
  }

  const verify2FA = async (email: string, code: string) => {
    try {
      const response = await apiClient.verify2FA({ email, code })

      if (response.success) {
        const data = response.data as any
        setUser(data.user)
        setSession(data.session)

        if (data.lawyerProfile) {
          setLawyerProfile(data.lawyerProfile)
        }
      }
    } catch (error) {
      console.error('2FA verification failed:', error)
      throw error
    }
  }

  const enable2FA = async () => {
    try {
      const response = await apiClient.enable2FA()
      return response.data
    } catch (error) {
      console.error('Enable 2FA failed:', error)
      throw error
    }
  }

  const verifyEnable2FA = async (code: string) => {
    try {
      const response = await apiClient.verifyEnable2FA(code)

      if (response.success) {
        // Refresh user to get updated 2FA status
        await refreshUser()
      }
    } catch (error) {
      console.error('Verify enable 2FA failed:', error)
      throw error
    }
  }

  const disable2FA = async (password: string) => {
    try {
      const response = await apiClient.disable2FA(password)

      if (response.success) {
        // Refresh user to get updated 2FA status
        await refreshUser()
      }
    } catch (error) {
      console.error('Disable 2FA failed:', error)
      throw error
    }
  }

  const getSessions = async () => {
    try {
      const response = await apiClient.getSessions()
      return response.data as Session[]
    } catch (error) {
      console.error('Get sessions failed:', error)
      throw error
    }
  }

  const revokeSession = async (sessionId: string) => {
    try {
      const response = await apiClient.revokeSession(sessionId)

      if (response.success) {
        // If current session was revoked, logout
        if (session?._id === sessionId) {
          await logout()
        }
      }
    } catch (error) {
      console.error('Revoke session failed:', error)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    lawyerProfile,
    session,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    logoutAll,
    updateProfile,
    changePassword,
    refreshUser,
    verify2FA,
    enable2FA,
    verifyEnable2FA,
    disable2FA,
    getSessions,
    revokeSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export type { User, LawyerProfile, Session, AuthContextType }
