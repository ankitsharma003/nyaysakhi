'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Search,
  Filter,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  User,
  MapPin,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'

export default function LawyerClientsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  const [searchQuery, setSearchQuery] = useState('')

  // Redirect if not authenticated or not a lawyer
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'lawyer')) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, user?.role, router])

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

  if (!isAuthenticated || user?.role !== 'lawyer') {
    return null
  }

  // Mock client data
  const clients = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91-9876543210',
      location: 'Delhi',
      caseType: 'Criminal Law',
      status: 'active',
      lastContact: '2024-01-15',
      totalCases: 2,
      avatar: null,
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91-9876543211',
      location: 'Mumbai',
      caseType: 'Family Law',
      status: 'active',
      lastContact: '2024-01-14',
      totalCases: 1,
      avatar: null,
    },
    {
      id: 3,
      name: 'Amit Singh',
      email: 'amit.singh@email.com',
      phone: '+91-9876543212',
      location: 'Bangalore',
      caseType: 'Corporate Law',
      status: 'inactive',
      lastContact: '2024-01-10',
      totalCases: 3,
      avatar: null,
    },
  ]

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.caseType.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return language === 'hi' ? 'सक्रिय' : 'Active'
      case 'inactive':
        return language === 'hi' ? 'निष्क्रिय' : 'Inactive'
      default:
        return status
    }
  }

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
            {language === 'hi' ? 'मेरे क्लाइंट्स' : 'My Clients'}
          </h1>
          <p className="mt-2 text-gray-600">
            {language === 'hi'
              ? 'अपने सभी क्लाइंट्स को देखें और प्रबंधित करें'
              : 'View and manage all your clients'}
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
                        ? 'क्लाइंट खोजें...'
                        : 'Search clients...'
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                  {language === 'hi' ? 'नया क्लाइंट' : 'New Client'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <Card key={client.id} className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                      <User className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {client.name}
                      </h3>
                      <p className="text-sm text-gray-600">{client.caseType}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                      client.status
                    )}`}
                  >
                    {getStatusText(client.status)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{client.email}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{client.phone}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{client.location}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {language === 'hi' ? 'अंतिम संपर्क' : 'Last Contact'}:{' '}
                      {client.lastContact}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      {client.totalCases} {language === 'hi' ? 'केस' : 'Cases'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t pt-3">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      {language === 'hi' ? 'देखें' : 'View'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <User className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                {language === 'hi'
                  ? 'कोई क्लाइंट नहीं मिला'
                  : 'No clients found'}
              </h3>
              <p className="text-gray-600">
                {language === 'hi'
                  ? 'कृपया अपना खोज शब्द बदलें या नया क्लाइंट जोड़ें'
                  : 'Please try changing your search term or add a new client'}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
