'use client'

import { useState, useEffect } from 'react'
import {
  Shield,
  Lock,
  Download,
  Trash2,
  Settings,
  CheckCircle,
  Database,
  FileText,
  User,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/lib/api'

interface PrivacySettings {
  dataEncryption: boolean
  twoFactorAuth: boolean
  dataRetention: number // days
  shareDataWithLawyers: boolean
  shareDataWithAI: boolean
  allowAnalytics: boolean
  allowCookies: boolean
  allowLocationTracking: boolean
  allowVoiceRecording: boolean
  allowDocumentStorage: boolean
  allowCaseHistory: boolean
  allowProfileSharing: boolean
}

interface DataRequest {
  id: string
  type: 'export' | 'delete' | 'rectify' | 'portability'
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  requestedAt: string
  completedAt?: string
  description: string
  dataSize?: number
  downloadUrl?: string
}

interface ConsentRecord {
  id: string
  purpose: string
  granted: boolean
  grantedAt: string
  revokedAt?: string
  expiresAt?: string
  version: string
}

interface PrivacyControlsProps {
  language?: 'en' | 'hi'
  onSettingsUpdate?: (settings: PrivacySettings) => void
}

export default function PrivacyControls({
  language = 'en',
  onSettingsUpdate,
}: PrivacyControlsProps) {
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    dataEncryption: true,
    twoFactorAuth: false,
    dataRetention: 365,
    shareDataWithLawyers: true,
    shareDataWithAI: false,
    allowAnalytics: true,
    allowCookies: true,
    allowLocationTracking: false,
    allowVoiceRecording: false,
    allowDocumentStorage: true,
    allowCaseHistory: true,
    allowProfileSharing: false,
  })
  const [dataRequests, setDataRequests] = useState<DataRequest[]>([])
  const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>([])
  const [activeTab, setActiveTab] = useState<
    'settings' | 'data-requests' | 'consent' | 'encryption'
  >('settings')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadPrivacyData()
  }, [])

  const loadPrivacyData = async () => {
    try {
      setLoading(true)
      // Mock data - in real app, this would be API calls
      const mockDataRequests: DataRequest[] = [
        {
          id: '1',
          type: 'export',
          status: 'completed',
          requestedAt: '2024-01-15',
          completedAt: '2024-01-16',
          description:
            language === 'hi'
              ? 'सभी व्यक्तिगत डेटा का निर्यात'
              : 'Export all personal data',
          dataSize: 1024 * 1024 * 5, // 5MB
          downloadUrl: '/downloads/personal-data.zip',
        },
        {
          id: '2',
          type: 'delete',
          status: 'processing',
          requestedAt: '2024-01-20',
          description:
            language === 'hi'
              ? 'खाता और सभी डेटा हटाना'
              : 'Delete account and all data',
        },
      ]

      const mockConsentRecords: ConsentRecord[] = [
        {
          id: '1',
          purpose:
            language === 'hi'
              ? 'कानूनी सलाह के लिए डेटा प्रसंस्करण'
              : 'Data processing for legal advice',
          granted: true,
          grantedAt: '2024-01-01',
          version: '1.0',
        },
        {
          id: '2',
          purpose:
            language === 'hi'
              ? 'विश्लेषण और सुधार के लिए डेटा उपयोग'
              : 'Data usage for analytics and improvement',
          granted: true,
          grantedAt: '2024-01-01',
          version: '1.0',
        },
        {
          id: '3',
          purpose:
            language === 'hi'
              ? 'वकीलों के साथ डेटा साझाकरण'
              : 'Data sharing with lawyers',
          granted: true,
          grantedAt: '2024-01-01',
          version: '1.0',
        },
      ]

      setDataRequests(mockDataRequests)
      setConsentRecords(mockConsentRecords)
    } catch (error) {
      console.error('Error loading privacy data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSettingChange = (
    key: keyof PrivacySettings,
    value: boolean | number
  ) => {
    const newSettings = { ...privacySettings, [key]: value }
    setPrivacySettings(newSettings)
    onSettingsUpdate?.(newSettings)
    savePrivacySettings(newSettings)
  }

  const savePrivacySettings = async (settings: PrivacySettings) => {
    try {
      await apiClient.updatePrivacySettings(settings)
    } catch (error) {
      console.error('Error saving privacy settings:', error)
    }
  }

  const handleDataRequest = async (type: DataRequest['type']) => {
    try {
      setLoading(true)
      const response = await apiClient.createDataRequest(type)
      setDataRequests((prev) => [response.data as any, ...prev])
    } catch (error) {
      console.error('Error creating data request:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConsentRevoke = async (consentId: string) => {
    try {
      await apiClient.revokeConsent(consentId)
      setConsentRecords((prev) =>
        prev.map((consent) =>
          consent.id === consentId
            ? {
                ...consent,
                granted: false,
                revokedAt: new Date().toISOString(),
              }
            : consent
        )
      )
    } catch (error) {
      console.error('Error revoking consent:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'hi' ? 'hi-IN' : 'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    )
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      processing: 'text-blue-600 bg-blue-100',
      completed: 'text-green-600 bg-green-100',
      rejected: 'text-red-600 bg-red-100',
    }
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100'
  }

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: language === 'hi' ? 'लंबित' : 'Pending',
      processing: language === 'hi' ? 'प्रसंस्करण' : 'Processing',
      completed: language === 'hi' ? 'पूर्ण' : 'Completed',
      rejected: language === 'hi' ? 'अस्वीकृत' : 'Rejected',
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  const getRequestTypeText = (type: string) => {
    const typeMap = {
      export: language === 'hi' ? 'डेटा निर्यात' : 'Data Export',
      delete: language === 'hi' ? 'डेटा हटाना' : 'Data Deletion',
      rectify: language === 'hi' ? 'डेटा सुधार' : 'Data Rectification',
      portability: language === 'hi' ? 'डेटा पोर्टेबिलिटी' : 'Data Portability',
    }
    return typeMap[type as keyof typeof typeMap] || type
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="py-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">
            {language === 'hi'
              ? 'गोपनीयता सेटिंग्स लोड हो रही हैं...'
              : 'Loading privacy settings...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {language === 'hi' ? 'गोपनीयता नियंत्रण' : 'Privacy Controls'}
        </h2>
        <p className="text-lg text-gray-600">
          {language === 'hi'
            ? 'अपनी व्यक्तिगत जानकारी और डेटा सुरक्षा को नियंत्रित करें'
            : 'Control your personal information and data security'}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            {
              id: 'settings',
              label: language === 'hi' ? 'सेटिंग्स' : 'Settings',
              icon: Settings,
            },
            {
              id: 'data-requests',
              label: language === 'hi' ? 'डेटा अनुरोध' : 'Data Requests',
              icon: FileText,
            },
            {
              id: 'consent',
              label: language === 'hi' ? 'सहमति' : 'Consent',
              icon: User,
            },
            {
              id: 'encryption',
              label: language === 'hi' ? 'एन्क्रिप्शन' : 'Encryption',
              icon: Lock,
            },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 border-b-2 px-1 py-4 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Data Encryption */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>
                  {language === 'hi' ? 'डेटा एन्क्रिप्शन' : 'Data Encryption'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">
                      {language === 'hi'
                        ? 'एंड-टू-एंड एन्क्रिप्शन'
                        : 'End-to-End Encryption'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {language === 'hi'
                        ? 'आपके सभी डेटा को एन्क्रिप्ट किया जाता है'
                        : 'All your data is encrypted'}
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={privacySettings.dataEncryption}
                      onChange={(e) =>
                        handleSettingChange('dataEncryption', e.target.checked)
                      }
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">
                      {language === 'hi'
                        ? 'दो-कारक प्रमाणीकरण'
                        : 'Two-Factor Authentication'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {language === 'hi'
                        ? 'अतिरिक्त सुरक्षा के लिए 2FA सक्षम करें'
                        : 'Enable 2FA for additional security'}
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={privacySettings.twoFactorAuth}
                      onChange={(e) =>
                        handleSettingChange('twoFactorAuth', e.target.checked)
                      }
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>
                  {language === 'hi' ? 'डेटा साझाकरण' : 'Data Sharing'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">
                      {language === 'hi'
                        ? 'वकीलों के साथ डेटा साझा करें'
                        : 'Share Data with Lawyers'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {language === 'hi'
                        ? 'कानूनी सलाह के लिए वकीलों के साथ डेटा साझा करें'
                        : 'Share data with lawyers for legal advice'}
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={privacySettings.shareDataWithLawyers}
                      onChange={(e) =>
                        handleSettingChange(
                          'shareDataWithLawyers',
                          e.target.checked
                        )
                      }
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">
                      {language === 'hi'
                        ? 'AI के साथ डेटा साझा करें'
                        : 'Share Data with AI'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {language === 'hi'
                        ? 'AI सुधार के लिए डेटा साझा करें'
                        : 'Share data for AI improvement'}
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={privacySettings.shareDataWithAI}
                      onChange={(e) =>
                        handleSettingChange('shareDataWithAI', e.target.checked)
                      }
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">
                      {language === 'hi'
                        ? 'विश्लेषण की अनुमति दें'
                        : 'Allow Analytics'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {language === 'hi'
                        ? 'सेवा सुधार के लिए विश्लेषण डेटा एकत्र करें'
                        : 'Collect analytics data for service improvement'}
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={privacySettings.allowAnalytics}
                      onChange={(e) =>
                        handleSettingChange('allowAnalytics', e.target.checked)
                      }
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>
                  {language === 'hi' ? 'डेटा प्रतिधारण' : 'Data Retention'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {language === 'hi'
                      ? 'डेटा प्रतिधारण अवधि (दिन)'
                      : 'Data Retention Period (Days)'}
                  </label>
                  <input
                    type="number"
                    value={privacySettings.dataRetention}
                    onChange={(e) =>
                      handleSettingChange(
                        'dataRetention',
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                    min="30"
                    max="2555" // 7 years
                  />
                  <p className="mt-1 text-sm text-gray-600">
                    {language === 'hi'
                      ? 'आपका डेटा कितने दिनों तक रखा जाएगा'
                      : 'How long your data will be kept'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Requests Tab */}
      {activeTab === 'data-requests' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {language === 'hi' ? 'डेटा अनुरोध' : 'Data Requests'}
            </h3>
            <div className="flex space-x-2">
              <Button
                onClick={() => handleDataRequest('export')}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Download className="mr-2 h-4 w-4" />
                {language === 'hi' ? 'डेटा निर्यात' : 'Export Data'}
              </Button>
              <Button
                onClick={() => handleDataRequest('delete')}
                disabled={loading}
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {language === 'hi' ? 'डेटा हटाएं' : 'Delete Data'}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {dataRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {getRequestTypeText(request.type)}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {request.description}
                      </p>
                      <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                        <span>
                          {language === 'hi' ? 'अनुरोध:' : 'Requested:'}{' '}
                          {formatDate(request.requestedAt)}
                        </span>
                        {request.completedAt && (
                          <span>
                            {language === 'hi' ? 'पूर्ण:' : 'Completed:'}{' '}
                            {formatDate(request.completedAt)}
                          </span>
                        )}
                        {request.dataSize && (
                          <span>
                            {language === 'hi' ? 'आकार:' : 'Size:'}{' '}
                            {formatFileSize(request.dataSize)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${getStatusColor(request.status)}`}
                      >
                        {getStatusText(request.status)}
                      </span>
                      {request.downloadUrl && (
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Consent Tab */}
      {activeTab === 'consent' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">
            {language === 'hi' ? 'सहमति रिकॉर्ड' : 'Consent Records'}
          </h3>

          <div className="space-y-4">
            {consentRecords.map((consent) => (
              <Card key={consent.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{consent.purpose}</h4>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                        <span>
                          {language === 'hi' ? 'सहमति दी:' : 'Consent Given:'}{' '}
                          {formatDate(consent.grantedAt)}
                        </span>
                        <span>
                          {language === 'hi' ? 'संस्करण:' : 'Version:'}{' '}
                          {consent.version}
                        </span>
                        {consent.expiresAt && (
                          <span>
                            {language === 'hi' ? 'समाप्ति:' : 'Expires:'}{' '}
                            {formatDate(consent.expiresAt)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          consent.granted
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {consent.granted
                          ? language === 'hi'
                            ? 'सक्रिय'
                            : 'Active'
                          : language === 'hi'
                            ? 'रद्द'
                            : 'Revoked'}
                      </span>
                      {consent.granted && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleConsentRevoke(consent.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Encryption Tab */}
      {activeTab === 'encryption' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>
                  {language === 'hi'
                    ? 'एन्क्रिप्शन स्थिति'
                    : 'Encryption Status'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium text-green-800">
                        {language === 'hi'
                          ? 'एंड-टू-एंड एन्क्रिप्शन सक्रिय'
                          : 'End-to-End Encryption Active'}
                      </h4>
                      <p className="text-sm text-green-700">
                        {language === 'hi'
                          ? 'आपके सभी डेटा को AES-256 एन्क्रिप्शन के साथ सुरक्षित किया गया है'
                          : 'All your data is secured with AES-256 encryption'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="mb-2 font-medium">
                      {language === 'hi'
                        ? 'एन्क्रिप्शन कुंजी'
                        : 'Encryption Key'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {language === 'hi'
                        ? '256-बिट AES कुंजी'
                        : '256-bit AES key'}
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="mb-2 font-medium">
                      {language === 'hi'
                        ? 'एन्क्रिप्शन प्रोटोकॉल'
                        : 'Encryption Protocol'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {language === 'hi'
                        ? 'TLS 1.3 + AES-256-GCM'
                        : 'TLS 1.3 + AES-256-GCM'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
