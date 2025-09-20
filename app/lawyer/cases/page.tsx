'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Search,
  Plus,
  FileText,
  Calendar,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'

export default function LawyerCasesPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

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

  // Mock case data
  const cases = [
    {
      id: 1,
      title: 'Criminal Defense - Theft Case',
      clientName: 'Rajesh Kumar',
      caseNumber: 'CR-2024-001',
      status: 'active',
      priority: 'high',
      courtDate: '2024-02-15',
      caseType: 'Criminal Law',
      description: 'Defending client against theft charges',
      createdAt: '2024-01-10',
      lastUpdated: '2024-01-20',
    },
    {
      id: 2,
      title: 'Divorce Proceedings',
      clientName: 'Priya Sharma',
      caseNumber: 'FAM-2024-002',
      status: 'pending',
      priority: 'medium',
      courtDate: '2024-02-20',
      caseType: 'Family Law',
      description: 'Handling divorce proceedings and custody arrangements',
      createdAt: '2024-01-12',
      lastUpdated: '2024-01-18',
    },
    {
      id: 3,
      title: 'Contract Dispute',
      clientName: 'Amit Singh',
      caseNumber: 'CIV-2024-003',
      status: 'closed',
      priority: 'low',
      courtDate: '2024-01-25',
      caseType: 'Corporate Law',
      description: 'Resolved contract dispute between two companies',
      createdAt: '2024-01-05',
      lastUpdated: '2024-01-25',
    },
  ]

  const filteredCases = cases.filter((caseItem) => {
    const matchesSearch =
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      selectedStatus === 'all' || caseItem.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'closed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return language === 'hi' ? 'सक्रिय' : 'Active'
      case 'pending':
        return language === 'hi' ? 'लंबित' : 'Pending'
      case 'closed':
        return language === 'hi' ? 'बंद' : 'Closed'
      default:
        return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return language === 'hi' ? 'उच्च' : 'High'
      case 'medium':
        return language === 'hi' ? 'मध्यम' : 'Medium'
      case 'low':
        return language === 'hi' ? 'कम' : 'Low'
      default:
        return priority
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'closed':
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
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
            {language === 'hi' ? 'केस प्रबंधन' : 'Case Management'}
          </h1>
          <p className="mt-2 text-gray-600">
            {language === 'hi'
              ? 'अपने सभी केसों को ट्रैक और प्रबंधित करें'
              : 'Track and manage all your cases'}
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
                      language === 'hi' ? 'केस खोजें...' : 'Search cases...'
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  aria-label={
                    language === 'hi' ? 'स्थिति फ़िल्टर' : 'Status Filter'
                  }
                >
                  <option value="all">
                    {language === 'hi' ? 'सभी स्थिति' : 'All Status'}
                  </option>
                  <option value="active">
                    {language === 'hi' ? 'सक्रिय' : 'Active'}
                  </option>
                  <option value="pending">
                    {language === 'hi' ? 'लंबित' : 'Pending'}
                  </option>
                  <option value="closed">
                    {language === 'hi' ? 'बंद' : 'Closed'}
                  </option>
                </select>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="mr-2 h-4 w-4" />
                  {language === 'hi' ? 'नया केस' : 'New Case'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cases List */}
        <div className="space-y-6">
          {filteredCases.map((caseItem) => (
            <Card
              key={caseItem.id}
              className="transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-3 flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-indigo-600" />
                      <span className="text-sm font-medium text-gray-500">
                        {caseItem.caseNumber}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                          caseItem.status
                        )}`}
                      >
                        {getStatusIcon(caseItem.status)}
                        <span className="ml-1">
                          {getStatusText(caseItem.status)}
                        </span>
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(
                          caseItem.priority
                        )}`}
                      >
                        {getPriorityText(caseItem.priority)}{' '}
                        {language === 'hi' ? 'प्राथमिकता' : 'Priority'}
                      </span>
                    </div>

                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                      {caseItem.title}
                    </h3>

                    <p className="mb-4 text-gray-600">{caseItem.description}</p>

                    <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-3">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>
                          <strong>
                            {language === 'hi' ? 'क्लाइंट' : 'Client'}:
                          </strong>{' '}
                          {caseItem.clientName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          <strong>
                            {language === 'hi' ? 'कोर्ट दिनांक' : 'Court Date'}:
                          </strong>{' '}
                          {caseItem.courtDate}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>
                          <strong>
                            {language === 'hi' ? 'केस प्रकार' : 'Case Type'}:
                          </strong>{' '}
                          {caseItem.caseType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col space-y-2">
                    <Button
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      {language === 'hi' ? 'देखें' : 'View'}
                    </Button>
                    <Button size="sm" variant="outline">
                      {language === 'hi' ? 'संपादित करें' : 'Edit'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCases.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                {language === 'hi' ? 'कोई केस नहीं मिला' : 'No cases found'}
              </h3>
              <p className="text-gray-600">
                {language === 'hi'
                  ? 'कृपया अपना खोज शब्द बदलें या नया केस जोड़ें'
                  : 'Please try changing your search term or add a new case'}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
