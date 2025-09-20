import React from 'react'
import { LoadingSpinner } from './loading-spinner'

interface PageLoaderProps {
  message?: string
  className?: string
}

export function PageLoader({
  message = 'Loading...',
  className = '',
}: PageLoaderProps) {
  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-gray-50 ${className}`}
    >
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4 text-indigo-600" />
        <p className="text-lg font-medium text-gray-900">{message}</p>
        <p className="mt-2 text-sm text-gray-500">
          Please wait while we load the page...
        </p>
      </div>
    </div>
  )
}

interface InlineLoaderProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function InlineLoader({
  message = 'Loading...',
  size = 'md',
  className = '',
}: InlineLoaderProps) {
  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <LoadingSpinner size={size} className="text-indigo-600" />
        <span className="text-sm font-medium text-gray-700">{message}</span>
      </div>
    </div>
  )
}
