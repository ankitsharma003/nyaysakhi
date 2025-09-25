'use client'

import Link from 'next/link'
import { Scale, ArrowLeft, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                <span className="hindi-text">न्याय सखी</span>
                <span className="ml-2 text-indigo-600">Nyāy Sakhi</span>
              </h1>
            </Link>
            <Link
              href="/"
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 transition-colors hover:text-indigo-600"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                Access Denied
              </CardTitle>
              <p className="mt-2 text-gray-600">
                You don&apos;t have permission to access this page
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="mb-4 text-sm text-gray-600">
                  This page requires specific permissions that your account
                  doesn&apos;t have. Please contact an administrator if you
                  believe this is an error.
                </p>

                <div className="space-y-3">
                  <Button asChild className="w-full">
                    <Link href="/">Go to Home</Link>
                  </Button>

                  <Button asChild variant="outline" className="w-full">
                    <Link href="/login">Sign In with Different Account</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
