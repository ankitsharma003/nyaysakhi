'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Scale } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  allowedRoles?: ('user' | 'lawyer' | 'admin')[]
}

export default function AuthGuard({
  children,
  requireAuth = true,
  allowedRoles = [],
}: AuthGuardProps) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (isLoading) return

    if (requireAuth && !isAuthenticated) {
      // Redirect to login if authentication is required but user is not authenticated
      router.push('/login')
      return
    }

    if (isAuthenticated && allowedRoles.length > 0 && user) {
      // Check if user has required role
      if (!allowedRoles.includes(user.role)) {
        // Redirect to unauthorized page or home
        router.push('/unauthorized')
        return
      }
    }

    setIsChecking(false)
  }, [isAuthenticated, user, isLoading, requireAuth, allowedRoles, router])

  // Show loading spinner while checking authentication
  if (isLoading || isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <Scale className="h-8 w-8 animate-pulse text-indigo-600" />
          </div>
          <div className="text-lg font-semibold text-gray-900">Loading...</div>
          <div className="text-sm text-gray-600">
            Please wait while we verify your access
          </div>
        </div>
      </div>
    )
  }

  // If authentication is not required or user is authenticated, render children
  if (!requireAuth || isAuthenticated) {
    return <>{children}</>
  }

  // This should not be reached due to the redirect above, but just in case
  return null
}
