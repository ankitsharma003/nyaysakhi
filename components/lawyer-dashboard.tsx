'use client'

import { useState, useEffect } from 'react'
import {
  Calendar,
  Clock,
  Users,
  MessageCircle,
  FileText,
  DollarSign,
  CheckCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { apiClient } from '@/lib/api'

interface Case {
  id: string
  title: string
  clientName: string
  clientEmail: string
  clientPhone: string
  caseType: string
  status: 'active' | 'pending' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  startDate: string
  nextHearingDate?: string
  description: string
  documents: Document[]
  notes: Note[]
  totalFee: number
  paidAmount: number
  lastActivity: string
}

interface Document {
  id: string
  name: string
  type: string
  uploadedAt: string
  size: number
  url: string
}

interface Note {
  id: string
  content: string
  createdAt: string
  type: 'general' | 'hearing' | 'client_meeting' | 'court_visit'
}

interface Appointment {
  id: string
  clientName: string
  date: string
  time: string
  type: 'in_person' | 'video_call' | 'phone_call'
  status: 'scheduled' | 'completed' | 'cancelled'
  caseId?: string
}

interface LawyerDashboardProps {
  lawyerId: string
  language?: 'en' | 'hi'
}

export default function LawyerDashboard({
  lawyerId,
  language = 'en',
}: LawyerDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'cases' | 'appointments' | 'clients' | 'documents'
  >('overview')
  const [cases, setCases] = useState<Case[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  // const [selectedCase, setSelectedCase] = useState<Case | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [lawyerId])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      // Mock data - in real app, this would be API calls
      const mockCases: Case[] = [
        {
          id: '1',
          title:
            language === 'hi' ? 'संपत्ति विवाद मामला' : 'Property Dispute Case',
          clientName: 'Amit Kumar',
          clientEmail: 'amit@email.com',
          clientPhone: '+91 98765 43210',
          caseType: language === 'hi' ? 'संपत्ति कानून' : 'Property Law',
          status: 'active',
          priority: 'high',
          startDate: '2024-01-15',
          nextHearingDate: '2024-02-15',
          description:
            language === 'hi'
              ? 'संपत्ति के स्वामित्व का विवाद'
              : 'Property ownership dispute',
          documents: [
            {
              id: '1',
              name: 'Property Deed',
              type: 'pdf',
              uploadedAt: '2024-01-15',
              size: 1024,
              url: '/documents/deed.pdf',
            },
            {
              id: '2',
              name: 'Court Notice',
              type: 'pdf',
              uploadedAt: '2024-01-20',
              size: 512,
              url: '/documents/notice.pdf',
            },
          ],
          notes: [
            {
              id: '1',
              content:
                language === 'hi'
                  ? 'प्रारंभिक सलाह दी गई'
                  : 'Initial consultation provided',
              createdAt: '2024-01-15',
              type: 'general',
            },
            {
              id: '2',
              content:
                language === 'hi'
                  ? 'अगली सुनवाई 15 फरवरी को'
                  : 'Next hearing on 15th February',
              createdAt: '2024-01-20',
              type: 'hearing',
            },
          ],
          totalFee: 50000,
          paidAmount: 25000,
          lastActivity: '2024-01-20',
        },
        {
          id: '2',
          title: language === 'hi' ? 'तलाक मामला' : 'Divorce Case',
          clientName: 'Priya Singh',
          clientEmail: 'priya@email.com',
          clientPhone: '+91 98765 43211',
          caseType: language === 'hi' ? 'पारिवारिक कानून' : 'Family Law',
          status: 'pending',
          priority: 'medium',
          startDate: '2024-01-10',
          description:
            language === 'hi' ? 'आपसी सहमति से तलाक' : 'Mutual consent divorce',
          documents: [
            {
              id: '3',
              name: 'Marriage Certificate',
              type: 'pdf',
              uploadedAt: '2024-01-10',
              size: 256,
              url: '/documents/marriage.pdf',
            },
          ],
          notes: [
            {
              id: '3',
              content:
                language === 'hi'
                  ? 'दस्तावेज जमा किए गए'
                  : 'Documents submitted',
              createdAt: '2024-01-10',
              type: 'general',
            },
          ],
          totalFee: 30000,
          paidAmount: 15000,
          lastActivity: '2024-01-10',
        },
      ]

      const mockAppointments: Appointment[] = [
        {
          id: '1',
          clientName: 'Amit Kumar',
          date: '2024-01-25',
          time: '10:00 AM',
          type: 'video_call',
          status: 'scheduled',
          caseId: '1',
        },
        {
          id: '2',
          clientName: 'Priya Singh',
          date: '2024-01-26',
          time: '2:00 PM',
          type: 'in_person',
          status: 'scheduled',
          caseId: '2',
        },
      ]

      setCases(mockCases)
      setAppointments(mockAppointments)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      scheduled: 'bg-blue-100 text-blue-800',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-red-600',
    }
    return colors[priority as keyof typeof colors] || 'text-gray-600'
  }

  const getStatusText = (status: string) => {
    const statusMap = {
      active: language === 'hi' ? 'सक्रिय' : 'Active',
      pending: language === 'hi' ? 'लंबित' : 'Pending',
      completed: language === 'hi' ? 'पूर्ण' : 'Completed',
      cancelled: language === 'hi' ? 'रद्द' : 'Cancelled',
      scheduled: language === 'hi' ? 'निर्धारित' : 'Scheduled',
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  const getPriorityText = (priority: string) => {
    const priorityMap = {
      low: language === 'hi' ? 'कम' : 'Low',
      medium: language === 'hi' ? 'मध्यम' : 'Medium',
      high: language === 'hi' ? 'उच्च' : 'High',
    }
    return priorityMap[priority as keyof typeof priorityMap] || priority
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'hi' ? 'hi-IN' : 'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }
    )
  }

  const getDashboardStats = () => {
    const totalCases = cases.length
    const activeCases = cases.filter((c) => c.status === 'active').length
    const pendingCases = cases.filter((c) => c.status === 'pending').length
    const completedCases = cases.filter((c) => c.status === 'completed').length
    const totalRevenue = cases.reduce((sum, c) => sum + c.paidAmount, 0)
    const pendingRevenue = cases.reduce(
      (sum, c) => sum + (c.totalFee - c.paidAmount),
      0
    )
    const upcomingAppointments = appointments.filter(
      (a) => a.status === 'scheduled'
    ).length

    return {
      totalCases,
      activeCases,
      pendingCases,
      completedCases,
      totalRevenue,
      pendingRevenue,
      upcomingAppointments,
    }
  }

  const stats = getDashboardStats()

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="py-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">
            {language === 'hi'
              ? 'डैशबोर्ड लोड हो रहा है...'
              : 'Loading dashboard...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            {language === 'hi' ? 'वकील डैशबोर्ड' : 'Lawyer Dashboard'}
          </h2>
          <p className="text-lg text-gray-600">
            {language === 'hi'
              ? 'अपने मामलों और क्लाइंट्स का प्रबंधन करें'
              : 'Manage your cases and clients'}
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" />
          {language === 'hi' ? 'नया मामला' : 'New Case'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            {
              id: 'overview',
              label: language === 'hi' ? 'अवलोकन' : 'Overview',
            },
            { id: 'cases', label: language === 'hi' ? 'मामले' : 'Cases' },
            {
              id: 'appointments',
              label: language === 'hi' ? 'अपॉइंटमेंट' : 'Appointments',
            },
            { id: 'clients', label: language === 'hi' ? 'क्लाइंट' : 'Clients' },
            {
              id: 'documents',
              label: language === 'hi' ? 'दस्तावेज' : 'Documents',
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {language === 'hi' ? 'कुल मामले' : 'Total Cases'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalCases}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="rounded-lg bg-green-100 p-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {language === 'hi' ? 'सक्रिय मामले' : 'Active Cases'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.activeCases}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="rounded-lg bg-yellow-100 p-2">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {language === 'hi' ? 'लंबित मामले' : 'Pending Cases'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.pendingCases}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="rounded-lg bg-purple-100 p-2">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {language === 'hi' ? 'कुल आय' : 'Total Revenue'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{stats.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Cases */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>
                  {language === 'hi' ? 'हाल के मामले' : 'Recent Cases'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cases.slice(0, 3).map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {caseItem.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {caseItem.clientName}
                      </p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span
                          className={`rounded px-2 py-1 text-xs font-medium ${getStatusColor(caseItem.status)}`}
                        >
                          {getStatusText(caseItem.status)}
                        </span>
                        <span
                          className={`text-xs ${getPriorityColor(caseItem.priority)}`}
                        >
                          {getPriorityText(caseItem.priority)}{' '}
                          {language === 'hi' ? 'प्राथमिकता' : 'Priority'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {language === 'hi'
                    ? 'आगामी अपॉइंटमेंट'
                    : 'Upcoming Appointments'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments
                  .filter((a) => a.status === 'scheduled')
                  .slice(0, 3)
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {appointment.clientName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {formatDate(appointment.date)} at {appointment.time}
                        </p>
                        <span className="text-xs capitalize text-gray-500">
                          {appointment.type.replace('_', ' ')}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'cases' && (
        <div className="space-y-6">
          {/* Cases Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {language === 'hi' ? 'सभी मामले' : 'All Cases'}
            </h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {language === 'hi' ? 'फिल्टर' : 'Filter'}
              </Button>
              <Button variant="outline" size="sm">
                <Search className="mr-2 h-4 w-4" />
                {language === 'hi' ? 'खोजें' : 'Search'}
              </Button>
            </div>
          </div>

          {/* Cases List */}
          <div className="space-y-4">
            {cases.map((caseItem) => (
              <Card
                key={caseItem.id}
                className="transition-shadow hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center space-x-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {caseItem.title}
                        </h4>
                        <span
                          className={`rounded px-2 py-1 text-xs font-medium ${getStatusColor(caseItem.status)}`}
                        >
                          {getStatusText(caseItem.status)}
                        </span>
                        <span
                          className={`text-xs ${getPriorityColor(caseItem.priority)}`}
                        >
                          {getPriorityText(caseItem.priority)}
                        </span>
                      </div>

                      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-sm text-gray-600">
                            {language === 'hi' ? 'क्लाइंट:' : 'Client:'}
                          </p>
                          <p className="font-medium">{caseItem.clientName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            {language === 'hi'
                              ? 'मामले का प्रकार:'
                              : 'Case Type:'}
                          </p>
                          <p className="font-medium">{caseItem.caseType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            {language === 'hi' ? 'शुरुआत तिथि:' : 'Start Date:'}
                          </p>
                          <p className="font-medium">
                            {formatDate(caseItem.startDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            {language === 'hi' ? 'कुल शुल्क:' : 'Total Fee:'}
                          </p>
                          <p className="font-medium">
                            ₹{caseItem.totalFee.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {caseItem.nextHearingDate && (
                        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">
                              {language === 'hi'
                                ? 'अगली सुनवाई:'
                                : 'Next Hearing:'}{' '}
                              {formatDate(caseItem.nextHearingDate)}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>
                          {language === 'hi' ? 'दस्तावेज:' : 'Documents:'}{' '}
                          {caseItem.documents.length}
                        </span>
                        <span>
                          {language === 'hi' ? 'नोट्स:' : 'Notes:'}{' '}
                          {caseItem.notes.length}
                        </span>
                        <span>
                          {language === 'hi'
                            ? 'अंतिम गतिविधि:'
                            : 'Last Activity:'}{' '}
                          {formatDate(caseItem.lastActivity)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">
            {language === 'hi' ? 'अपॉइंटमेंट' : 'Appointments'}
          </h3>

          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {appointment.clientName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {formatDate(appointment.date)} at {appointment.time}
                      </p>
                      <span className="text-xs capitalize text-gray-500">
                        {appointment.type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${getStatusColor(appointment.status)}`}
                      >
                        {getStatusText(appointment.status)}
                      </span>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'clients' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">
            {language === 'hi' ? 'क्लाइंट' : 'Clients'}
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cases.map((caseItem) => (
              <Card key={caseItem.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                      <Users className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {caseItem.clientName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {caseItem.clientEmail}
                      </p>
                      <p className="text-sm text-gray-600">
                        {caseItem.clientPhone}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      {language === 'hi' ? 'सक्रिय मामले:' : 'Active Cases:'} 1
                    </p>
                    <p className="text-sm text-gray-600">
                      {language === 'hi' ? 'कुल भुगतान:' : 'Total Paid:'} ₹
                      {caseItem.paidAmount.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">
            {language === 'hi' ? 'दस्तावेज' : 'Documents'}
          </h3>

          <div className="space-y-4">
            {cases
              .flatMap((caseItem) =>
                caseItem.documents.map((doc) => ({
                  ...doc,
                  caseTitle: caseItem.title,
                }))
              )
              .map((document) => (
                <Card key={document.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <FileText className="h-8 w-8 text-gray-500" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {document.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {document.caseTitle}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(document.uploadedAt)} •{' '}
                            {(document.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
