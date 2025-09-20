'use client'

import { useAuth } from '@/lib/auth-context'
import { PageLoader } from '@/components/ui/page-loader'
import { ReactNode } from 'react'

interface AuthLoadingWrapperProps {
  children: ReactNode
}

export function AuthLoadingWrapper({ children }: AuthLoadingWrapperProps) {
  const { isLoading } = useAuth()

  if (isLoading) {
    return <PageLoader message="Initializing application..." />
  }

  return <>{children}</>
}
