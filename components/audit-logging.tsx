'use client'

import { useState, useEffect } from 'react'
import {
  Shield,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  FileText,
  Database,
  Filter,
  Download,
  RefreshCw,
  X,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { apiClient } from '@/lib/api'

interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string
  resource: string
  resourceId: string
  ipAddress: string
  userAgent: string
  status: 'success' | 'failure' | 'warning'
  details: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  category:
    | 'authentication'
    | 'data_access'
    | 'data_modification'
    | 'system'
    | 'security'
  location?: string
  sessionId: string
}

interface SecurityAlert {
  id: string
  timestamp: string
  type:
    | 'suspicious_login'
    | 'data_breach'
    | 'unauthorized_access'
    | 'failed_authentication'
    | 'privilege_escalation'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  userId?: string
  ipAddress: string
  resolved: boolean
  resolvedAt?: string
  resolvedBy?: string
}

interface AuditLoggingProps {
  language?: 'en' | 'hi'
  onAlertClick?: (alert: SecurityAlert) => void
}

type TabId = 'logs' | 'alerts' | 'analytics'

export default function AuditLogging({
  language = 'en',
  onAlertClick,
}: AuditLoggingProps) {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([])
  const [activeTab, setActiveTab] = useState<TabId>('logs')
  const [filters, setFilters] = useState({
    category: '',
    severity: '',
    status: '',
    dateRange: '7d',
    search: '',
  })
  const [loading, setLoading] = useState(false)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  useEffect(() => {
    loadAuditData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const loadAuditData = async () => {
    try {
      setLoading(true)
      // Mock audit data - in real app, this would be API calls
      const mockAuditLogs: AuditLog[] = [
        {
          id: '1',
          timestamp: '2024-01-25T10:30:00Z',
          userId: 'user1',
          userName: 'Amit Kumar',
          action: 'login',
          resource: 'authentication',
          resourceId: 'auth_session_123',
          ipAddress: '192.168.1.100',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'success',
          details: language === 'hi' ? 'सफल लॉगिन' : 'Successful login',
          severity: 'low',
          category: 'authentication',
          location: 'Delhi, India',
          sessionId: 'session_123',
        },
        {
          id: '2',
          timestamp: '2024-01-25T10:25:00Z',
          userId: 'user2',
          userName: 'Priya Singh',
          action: 'document_upload',
          resource: 'document',
          resourceId: 'doc_456',
          ipAddress: '192.168.1.101',
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          status: 'success',
          details:
            language === 'hi'
              ? 'दस्तावेज़ अपलोड किया गया'
              : 'Document uploaded',
          severity: 'medium',
          category: 'data_modification',
          location: 'Mumbai, India',
          sessionId: 'session_456',
        },
        {
          id: '3',
          timestamp: '2024-01-25T10:20:00Z',
          userId: 'user3',
          userName: 'Ravi Verma',
          action: 'failed_login',
          resource: 'authentication',
          resourceId: 'auth_attempt_789',
          ipAddress: '192.168.1.102',
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          status: 'failure',
          details: language === 'hi' ? 'गलत पासवर्ड' : 'Incorrect password',
          severity: 'medium',
          category: 'authentication',
          location: 'Bangalore, India',
          sessionId: 'session_789',
        },
        {
          id: '4',
          timestamp: '2024-01-25T10:15:00Z',
          userId: 'user1',
          userName: 'Amit Kumar',
          action: 'data_export',
          resource: 'user_data',
          resourceId: 'export_123',
          ipAddress: '192.168.1.100',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'success',
          details:
            language === 'hi'
              ? 'व्यक्तिगत डेटा निर्यात किया गया'
              : 'Personal data exported',
          severity: 'high',
          category: 'data_access',
          location: 'Delhi, India',
          sessionId: 'session_123',
        },
        {
          id: '5',
          timestamp: '2024-01-25T10:10:00Z',
          userId: 'user4',
          userName: 'Unknown User',
          action: 'unauthorized_access',
          resource: 'admin_panel',
          resourceId: 'admin_access_attempt',
          ipAddress: '192.168.1.200',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'failure',
          details:
            language === 'hi'
              ? 'अनधिकृत पहुंच का प्रयास'
              : 'Unauthorized access attempt',
          severity: 'critical',
          category: 'security',
          location: 'Unknown',
          sessionId: 'session_unknown',
        },
      ]

      const mockSecurityAlerts: SecurityAlert[] = [
        {
          id: '1',
          timestamp: '2024-01-25T10:10:00Z',
          type: 'unauthorized_access',
          severity: 'critical',
          description:
            language === 'hi'
              ? 'अनधिकृत पहुंच का प्रयास - अज्ञात उपयोगकर्ता ने एडमिन पैनल तक पहुंचने का प्रयास किया'
              : 'Unauthorized access attempt - Unknown user attempted to access admin panel',
          ipAddress: '192.168.1.200',
          resolved: false,
        },
        {
          id: '2',
          timestamp: '2024-01-25T09:45:00Z',
          type: 'suspicious_login',
          severity: 'high',
          description:
            language === 'hi'
              ? 'संदिग्ध लॉगिन - असामान्य स्थान से लॉगिन प्रयास'
              : 'Suspicious login - Login attempt from unusual location',
          userId: 'user2',
          ipAddress: '192.168.1.150',
          resolved: true,
          resolvedAt: '2024-01-25T10:00:00Z',
          resolvedBy: 'admin1',
        },
        {
          id: '3',
          timestamp: '2024-01-25T09:30:00Z',
          type: 'failed_authentication',
          severity: 'medium',
          description:
            language === 'hi'
              ? 'कई असफल प्रमाणीकरण प्रयास - ब्रूट फोर्स अटैक का संकेत'
              : 'Multiple failed authentication attempts - Possible brute force attack',
          userId: 'user3',
          ipAddress: '192.168.1.102',
          resolved: true,
          resolvedAt: '2024-01-25T09:35:00Z',
          resolvedBy: 'system',
        },
      ]

      setAuditLogs(mockAuditLogs)
      setSecurityAlerts(mockSecurityAlerts)
    } catch (error) {
      console.error('Error loading audit data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      high: 'text-orange-600 bg-orange-100',
      critical: 'text-red-600 bg-red-100',
    }
    return (
      colors[severity as keyof typeof colors] || 'text-gray-600 bg-gray-100'
    )
  }

  const getStatusColor = (status: string) => {
    const colors = {
      success: 'text-green-600 bg-green-100',
      failure: 'text-red-600 bg-red-100',
      warning: 'text-yellow-600 bg-yellow-100',
    }
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100'
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      authentication: User,
      data_access: Eye,
      data_modification: FileText,
      system: Database,
      security: Shield,
    }
    const Icon = icons[category as keyof typeof icons] || Shield
    return <Icon className="h-4 w-4" />
  }

  const getSeverityText = (severity: string) => {
    const severityMap = {
      low: language === 'hi' ? 'कम' : 'Low',
      medium: language === 'hi' ? 'मध्यम' : 'Medium',
      high: language === 'hi' ? 'उच्च' : 'High',
      critical: language === 'hi' ? 'गंभीर' : 'Critical',
    }
    return severityMap[severity as keyof typeof severityMap] || severity
  }

  const getStatusText = (status: string) => {
    const statusMap = {
      success: language === 'hi' ? 'सफल' : 'Success',
      failure: language === 'hi' ? 'असफल' : 'Failure',
      warning: language === 'hi' ? 'चेतावनी' : 'Warning',
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  const getCategoryText = (category: string) => {
    const categoryMap = {
      authentication: language === 'hi' ? 'प्रमाणीकरण' : 'Authentication',
      data_access: language === 'hi' ? 'डेटा पहुंच' : 'Data Access',
      data_modification:
        language === 'hi' ? 'डेटा संशोधन' : 'Data Modification',
      system: language === 'hi' ? 'सिस्टम' : 'System',
      security: language === 'hi' ? 'सुरक्षा' : 'Security',
    }
    return categoryMap[category as keyof typeof categoryMap] || category
  }

  const getAlertTypeText = (type: string) => {
    const typeMap = {
      suspicious_login:
        language === 'hi' ? 'संदिग्ध लॉगिन' : 'Suspicious Login',
      data_breach: language === 'hi' ? 'डेटा उल्लंघन' : 'Data Breach',
      unauthorized_access:
        language === 'hi' ? 'अनधिकृत पहुंच' : 'Unauthorized Access',
      failed_authentication:
        language === 'hi' ? 'असफल प्रमाणीकरण' : 'Failed Authentication',
      privilege_escalation:
        language === 'hi' ? 'विशेषाधिकार वृद्धि' : 'Privilege Escalation',
    }
    return typeMap[type as keyof typeof typeMap] || type
  }

  // Use toLocaleString so time options are valid
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(
      language === 'hi' ? 'hi-IN' : 'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }
    )
  }

  const filteredLogs = auditLogs.filter((log) => {
    if (filters.category && log.category !== filters.category) return false
    if (filters.severity && log.severity !== filters.severity) return false
    if (filters.status && log.status !== filters.status) return false
    if (
      filters.search &&
      !log.action.toLowerCase().includes(filters.search.toLowerCase()) &&
      !log.userName.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false
    return true
  })

  const filteredAlerts = securityAlerts.filter((alert) => {
    if (filters.severity && alert.severity !== filters.severity) return false
    if (
      filters.search &&
      !alert.description.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false
    return true
  })

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="py-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">
            {language === 'hi'
              ? 'ऑडिट डेटा लोड हो रहा है...'
              : 'Loading audit data...'}
          </p>
        </div>
      </div>
    )
  }

  const tabs: { id: TabId; label: string; icon: any }[] = [
    {
      id: 'logs',
      label: language === 'hi' ? 'ऑडिट लॉग' : 'Audit Logs',
      icon: FileText,
    },
    {
      id: 'alerts',
      label: language === 'hi' ? 'सुरक्षा अलर्ट' : 'Security Alerts',
      icon: AlertTriangle,
    },
    {
      id: 'analytics',
      label: language === 'hi' ? 'विश्लेषण' : 'Analytics',
      icon: Database,
    },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {language === 'hi'
            ? 'ऑडिट लॉगिंग और निगरानी'
            : 'Audit Logging & Monitoring'}
        </h2>
        <p className="text-lg text-gray-600">
          {language === 'hi'
            ? 'सिस्टम गतिविधि और सुरक्षा घटनाओं की निगरानी करें'
            : 'Monitor system activity and security events'}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 border-b-2 px-1 py-4 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                type="button"
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="min-w-48 flex-1">
              <input
                aria-label={language === 'hi' ? 'खोजें' : 'Search'}
                type="text"
                placeholder={language === 'hi' ? 'खोजें...' : 'Search...'}
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              aria-label={language === 'hi' ? 'श्रेणी' : 'Category'}
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value }))
              }
              className="rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">
                {language === 'hi' ? 'सभी श्रेणियां' : 'All Categories'}
              </option>
              <option value="authentication">
                {language === 'hi' ? 'प्रमाणीकरण' : 'Authentication'}
              </option>
              <option value="data_access">
                {language === 'hi' ? 'डेटा पहुंच' : 'Data Access'}
              </option>
              <option value="data_modification">
                {language === 'hi' ? 'डेटा संशोधन' : 'Data Modification'}
              </option>
              <option value="system">
                {language === 'hi' ? 'सिस्टम' : 'System'}
              </option>
              <option value="security">
                {language === 'hi' ? 'सुरक्षा' : 'Security'}
              </option>
            </select>
            <select
              aria-label={language === 'hi' ? 'गंभीरता' : 'Severity'}
              value={filters.severity}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, severity: e.target.value }))
              }
              className="rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">
                {language === 'hi' ? 'सभी गंभीरता' : 'All Severities'}
              </option>
              <option value="low">{language === 'hi' ? 'कम' : 'Low'}</option>
              <option value="medium">
                {language === 'hi' ? 'मध्यम' : 'Medium'}
              </option>
              <option value="high">
                {language === 'hi' ? 'उच्च' : 'High'}
              </option>
              <option value="critical">
                {language === 'hi' ? 'गंभीर' : 'Critical'}
              </option>
            </select>
            <select
              aria-label={language === 'hi' ? 'स्थिति' : 'Status'}
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className="rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">
                {language === 'hi' ? 'सभी स्थिति' : 'All Status'}
              </option>
              <option value="success">
                {language === 'hi' ? 'सफल' : 'Success'}
              </option>
              <option value="failure">
                {language === 'hi' ? 'असफल' : 'Failure'}
              </option>
              <option value="warning">
                {language === 'hi' ? 'चेतावनी' : 'Warning'}
              </option>
            </select>
            <Button
              onClick={() =>
                setFilters({
                  category: '',
                  severity: '',
                  status: '',
                  dateRange: '7d',
                  search: '',
                })
              }
              variant="outline"
              size="sm"
              type="button"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {language === 'hi' ? 'रीसेट' : 'Reset'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Tab */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {language === 'hi' ? 'ऑडिट लॉग' : 'Audit Logs'} (
              {filteredLogs.length})
            </h3>
            <Button variant="outline" size="sm" type="button">
              <Download className="mr-2 h-4 w-4" />
              {language === 'hi' ? 'निर्यात' : 'Export'}
            </Button>
          </div>

          <div className="space-y-2">
            {filteredLogs.map((log) => (
              <Card key={log.id} className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getCategoryIcon(log.category)}
                      <div className="flex-1">
                        <div className="mb-1 flex items-center space-x-2">
                          <h4 className="font-medium">{log.action}</h4>
                          <span
                            className={`rounded px-2 py-1 text-xs font-medium ${getSeverityColor(log.severity)}`}
                          >
                            {getSeverityText(log.severity)}
                          </span>
                          <span
                            className={`rounded px-2 py-1 text-xs font-medium ${getStatusColor(log.status)}`}
                          >
                            {getStatusText(log.status)}
                          </span>
                        </div>
                        <p className="mb-1 text-sm text-gray-600">
                          {log.details}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{log.userName}</span>
                          <span>{getCategoryText(log.category)}</span>
                          <span>{log.ipAddress}</span>
                          <span>{log.location || 'Unknown'}</span>
                          <span>{formatDate(log.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                      type="button"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Security Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {language === 'hi' ? 'सुरक्षा अलर्ट' : 'Security Alerts'} (
              {filteredAlerts.length})
            </h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" type="button">
                <Filter className="mr-2 h-4 w-4" />
                {language === 'hi' ? 'फिल्टर' : 'Filter'}
              </Button>
              <Button variant="outline" size="sm" type="button">
                <Download className="mr-2 h-4 w-4" />
                {language === 'hi' ? 'निर्यात' : 'Export'}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card
                key={alert.id}
                className={`transition-shadow hover:shadow-md ${
                  alert.severity === 'critical'
                    ? 'border-red-200 bg-red-50'
                    : alert.severity === 'high'
                      ? 'border-orange-200 bg-orange-50'
                      : 'border-gray-200'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <AlertTriangle
                        className={`mt-1 h-5 w-5 ${
                          alert.severity === 'critical'
                            ? 'text-red-600'
                            : alert.severity === 'high'
                              ? 'text-orange-600'
                              : 'text-yellow-600'
                        }`}
                      />
                      <div className="flex-1">
                        <div className="mb-2 flex items-center space-x-2">
                          <h4 className="font-medium">
                            {getAlertTypeText(alert.type)}
                          </h4>
                          <span
                            className={`rounded px-2 py-1 text-xs font-medium ${getSeverityColor(
                              alert.severity
                            )}`}
                          >
                            {getSeverityText(alert.severity)}
                          </span>
                          {alert.resolved && (
                            <span className="flex items-center space-x-1 text-xs text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              <span>
                                {language === 'hi' ? 'हल' : 'Resolved'}
                              </span>
                            </span>
                          )}
                        </div>
                        <p className="mb-2 text-sm text-gray-700">
                          {alert.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{alert.ipAddress}</span>
                          <span>{formatDate(alert.timestamp)}</span>
                          {alert.resolvedAt && (
                            <span>
                              {language === 'hi' ? 'हल किया गया:' : 'Resolved:'}{' '}
                              {formatDate(alert.resolvedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!alert.resolved && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAlertClick?.(alert)}
                          className="text-indigo-600 hover:text-indigo-700"
                          type="button"
                        >
                          {language === 'hi' ? 'हल करें' : 'Resolve'}
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" type="button">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">
            {language === 'hi' ? 'सुरक्षा विश्लेषण' : 'Security Analytics'}
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="rounded-lg bg-red-100 p-2">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {language === 'hi' ? 'गंभीर अलर्ट' : 'Critical Alerts'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        securityAlerts.filter(
                          (a) => a.severity === 'critical' && !a.resolved
                        ).length
                      }
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
                      {language === 'hi' ? 'आज के लॉग' : "Today's Logs"}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        auditLogs.filter(
                          (log) =>
                            new Date(log.timestamp).toDateString() ===
                            new Date().toDateString()
                        ).length
                      }
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
                      {language === 'hi'
                        ? 'सफल क्रियाएं'
                        : 'Successful Actions'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        auditLogs.filter((log) => log.status === 'success')
                          .length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {language === 'hi' ? 'सुरक्षा घटनाएं' : 'Security Events'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        auditLogs.filter((log) => log.category === 'security')
                          .length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {language === 'hi' ? 'लॉग विवरण' : 'Log Details'}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLog(null)}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {language === 'hi' ? 'क्रिया' : 'Action'}
                    </label>
                    <p className="text-gray-900">{selectedLog.action}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {language === 'hi' ? 'उपयोगकर्ता' : 'User'}
                    </label>
                    <p className="text-gray-900">{selectedLog.userName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {language === 'hi' ? 'आईपी पता' : 'IP Address'}
                    </label>
                    <p className="text-gray-900">{selectedLog.ipAddress}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {language === 'hi' ? 'स्थान' : 'Location'}
                    </label>
                    <p className="text-gray-900">
                      {selectedLog.location || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {language === 'hi' ? 'समय' : 'Timestamp'}
                    </label>
                    <p className="text-gray-900">
                      {formatDate(selectedLog.timestamp)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {language === 'hi' ? 'सत्र आईडी' : 'Session ID'}
                    </label>
                    <p className="font-mono text-sm text-gray-900">
                      {selectedLog.sessionId}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {language === 'hi' ? 'विवरण' : 'Details'}
                  </label>
                  <p className="text-gray-900">{selectedLog.details}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {language === 'hi' ? 'यूजर एजेंट' : 'User Agent'}
                  </label>
                  <p className="break-all font-mono text-sm text-gray-900">
                    {selectedLog.userAgent}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
