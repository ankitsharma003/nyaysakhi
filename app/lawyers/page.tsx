'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  Star,
  Phone,
  Mail,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'

export default function LawyersPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [language, setLanguage] = useState<'en' | 'hi'>('en')

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-lg font-medium text-gray-900">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // Mock lawyer data
  const lawyers = [
    {
      id: 1,
      name: 'Adv. Rajesh Kumar',
      specialization: 'Criminal Law',
      experience: '15 years',
      rating: 4.8,
      location: 'Delhi',
      consultationFee: '₹2000',
      languages: ['Hindi', 'English'],
      verified: true,
    },
    {
      id: 2,
      name: 'Adv. Priya Sharma',
      specialization: 'Family Law',
      experience: '12 years',
      rating: 4.9,
      location: 'Mumbai',
      consultationFee: '₹2500',
      languages: ['Hindi', 'English', 'Marathi'],
      verified: true,
    },
    {
      id: 3,
      name: 'Adv. Amit Singh',
      specialization: 'Corporate Law',
      experience: '18 years',
      rating: 4.7,
      location: 'Bangalore',
      consultationFee: '₹3000',
      languages: ['Hindi', 'English', 'Kannada'],
      verified: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600"
              >
                {language === 'en' ? 'हिंदी' : 'English'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'hi' ? 'वकील खोजें' : 'Find Lawyers'}
          </h1>
          <p className="mt-2 text-gray-600">
            {language === 'hi'
              ? 'अपने क्षेत्र में सत्यापित वकीलों को खोजें और संपर्क करें'
              : 'Find and contact verified lawyers in your area'}
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <input
                    type="text"
                    placeholder={
                      language === 'hi'
                        ? 'वकील या विशेषज्ञता खोजें...'
                        : 'Search lawyers or specialization...'
                    }
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  {language === 'hi' ? 'फ़िल्टर' : 'Filter'}
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  {language === 'hi' ? 'खोजें' : 'Search'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lawyers Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lawyers.map((lawyer) => (
            <Card key={lawyer.id} className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                      <User className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {lawyer.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {lawyer.specialization}
                      </p>
                    </div>
                  </div>
                  {lawyer.verified && (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      ✓ Verified
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>{lawyer.rating}</span>
                    <span>•</span>
                    <span>{lawyer.experience} experience</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{lawyer.location}</span>
                  </div>

                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Languages:</span>{' '}
                    {lawyer.languages.join(', ')}
                  </div>

                  <div className="flex items-center justify-between border-t pt-3">
                    <div className="text-lg font-semibold text-indigo-600">
                      {lawyer.consultationFee}/consultation
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        {language === 'hi' ? 'संपर्क करें' : 'Contact'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <Button variant="outline" size="lg">
            {language === 'hi' ? 'और वकील देखें' : 'Load More Lawyers'}
          </Button>
        </div>
      </main>
    </div>
  )
}
